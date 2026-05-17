import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "mysuru-heritage-secret-key-2024";

// Firebase Admin Initialization
let db: any;

const createMockDb = () => {
  const mockData: any = { artisans: {}, products: {}, orders: {}, users: {}, vlogs: {}, activity_logs: {}, visits: {}, analytics: {} };
  return {
    collection: (name: string) => ({
      doc: (id?: string) => {
        const docId = id || Math.random().toString(36).substring(7);
        return {
          id: docId,
          get: async () => ({ exists: !!mockData[name]?.[docId], data: () => mockData[name]?.[docId] }),
          set: async (data: any) => { if (!mockData[name]) mockData[name] = {}; mockData[name][docId] = data; },
          update: async (data: any) => { if (!mockData[name]) mockData[name] = {}; mockData[name][docId] = { ...mockData[name][docId], ...data }; },
          delete: async () => { if (mockData[name]) delete mockData[name][docId]; }
        };
      },
      add: async (data: any) => {
        const docId = Math.random().toString(36).substring(7);
        if (!mockData[name]) mockData[name] = {};
        mockData[name][docId] = data;
        return { id: docId, path: `${name}/${docId}` };
      },
      where: (field: string, op: string, val: any) => {
         const filterDocs = () => {
           if (!mockData[name]) return [];
           return Object.entries(mockData[name])
            .filter(([_, d]: any) => d[field] === val)
            .map(([id, d]: any) => ({ id, data: () => d }));
         };
         return {
            get: async () => ({ docs: filterDocs() }),
            limit: (num: number) => ({ get: async () => ({ docs: filterDocs().slice(0, num) }) })
         };
      },
      get: async () => ({
        docs: Object.entries(mockData[name] || {}).map(([id, d]: any) => ({ id, data: () => d })),
        size: Object.keys(mockData[name] || {}).length
      })
    })
  };
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Auth Middleware
const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization?.split(" ")[1]) || (req.query.token as string);
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await db.collection("users").doc(req.user.id).get();
    if (user.exists && user.data().role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Admin access required" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

import { EventEmitter } from "events";
const activityEmitter = new EventEmitter();

const logActivity = async (data: {
  userId: string;
  username?: string;
  role: string;
  activityType: string;
  activityMessage: string;
  pageVisited?: string;
  productId?: string;
  placeId?: string;
  deviceType?: string;
  location?: string;
}) => {
  try {
    const log = {
      ...data,
      timestamp: new Date().toISOString()
    };
    const docRef = await db.collection("activity_logs").add(log);
    const logWithId = { id: docRef.id, ...log };
    activityEmitter.emit("new_activity", logWithId);
  } catch (err) {
    console.error("Activity logging failed", err);
  }
};

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ... existing code ...

export async function createServer() {
  const app = express();
  app.use(express.json());

  // Initialize DB asynchronously
  const CONFIG_PATH = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
      if (getApps().length === 0) {
        initializeApp({ projectId: config.projectId });
      }
      // Pass databaseId to getFirestore
      const adminDb = getFirestore(getApps()[0], config.firestoreDatabaseId);
      
      // Ping check
      await adminDb.collection("users").limit(1).get();
      db = adminDb;
      console.log("Firebase Admin SDK connected successfully.");
    } catch (err: any) {
      console.warn("Firebase Admin connection failed, running with mock database. Reason:", err.message);
      db = createMockDb();
    }
  } else {
    console.warn("Firebase config not found. Running with mock database.");
    db = createMockDb();
  }

  // Seed Admin User
  const seedAdmin = async () => {
    try {
      const adminEmail = "admin@mysuru.portal";
      const adminPassword = "Admin@Portal@2024";
      const snapshot = await db.collection("users").where("role", "==", "admin").get();
      if (snapshot.docs.length === 0) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminId = "admin-sys-001";
        await db.collection("users").doc(adminId).set({
          id: adminId,
          email: adminEmail,
          password: hashedPassword,
          displayName: "System Admin",
          role: "admin",
          createdAt: new Date().toISOString()
        });
        
        // Also create an 'artisan' record for login compatibility
        await db.collection("artisans").doc(adminId).set({
          id: adminId,
          email: adminEmail,
          password: hashedPassword,
          artisanName: "System Admin",
          craftType: "System",
          verificationStatus: "verified",
          createdAt: new Date().toISOString()
        });
        
        console.log("Seed admin created:", adminEmail, adminPassword);
      }
    } catch (err) {
      console.error("Seed admin failed", err);
    }
  };
  seedAdmin();

  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // Image/File Upload Route (Authenticated for Artisans, Public for Vlogs for now as no Traveler auth yet)
  app.post("/api/upload", upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
  const PORT = 3000;

  // --- Unified Auth Routes ---

  app.post("/api/auth/google", async (req, res) => {
    try {
      const { uid, email, displayName, photoURL } = req.body;
      
      let userRef = db.collection("users").doc(uid);
      let user = await userRef.get();
      
      const isNew = !user.exists;
      const userData = isNew ? {
        uid,
        email,
        displayName,
        role: "customer",
        profileImage: photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      } : {
        ...user.data(),
        lastLogin: new Date().toISOString()
      };

      if (isNew) {
        await userRef.set(userData);
      } else {
        await userRef.update({ lastLogin: userData.lastLogin });
      }

      const token = jwt.sign({ id: uid, email, role: userData.role }, JWT_SECRET, { expiresIn: "7d" });
      
      await logActivity({
        userId: uid,
        role: userData.role,
        activityType: "login",
        activityMessage: `User logged in via Google: ${displayName}`,
        username: displayName
      });

      res.json({ token, user: userData });
    } catch (err) {
      res.status(500).json({ error: "Google sync failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, displayName, role = "customer" } = req.body;
      
      const existing = await db.collection("users").where("email", "==", email).get();
      if (existing.docs.length > 0) return res.status(400).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const uid = Math.random().toString(36).substring(7);
      
      const userData = {
        uid,
        email,
        password: hashedPassword,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      await db.collection("users").doc(uid).set(userData);
      
      const token = jwt.sign({ id: uid, email, role }, JWT_SECRET, { expiresIn: "7d" });

      await logActivity({
        userId: uid,
        role,
        activityType: "register",
        activityMessage: `New ${role} registered: ${displayName}`,
        username: displayName
      });

      const { password: _, ...userPublic } = userData;
      res.status(201).json({ token, user: userPublic });
    } catch (err) {
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const snapshot = await db.collection("users").where("email", "==", email).get();
      
      if (snapshot.docs.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = snapshot.docs[0].data();
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.uid || user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      
      await db.collection("users").doc(user.uid || user.id).update({ lastLogin: new Date().toISOString() });

      await logActivity({
        userId: user.uid || user.id,
        role: user.role,
        activityType: "login",
        activityMessage: `${user.role} logged in: ${user.displayName}`,
        username: user.displayName
      });

      const { password: _, ...userPublic } = user;
      res.json({ token, user: userPublic });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/session/start", async (req, res) => {
    try {
      const { userId, device, browser } = req.body;
      const docRef = await db.collection("sessions").add({
        userId,
        loginTime: new Date().toISOString(),
        device,
        browser,
        ipAddress: req.ip
      });
      res.json({ sessionId: docRef.id });
    } catch (err) {
      res.status(500).json({ error: "Session logging failed" });
    }
  });

  app.post("/api/auth/session/end", async (req, res) => {
    try {
      const { sessionId } = req.body;
      await db.collection("sessions").doc(sessionId).update({
        logoutTime: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Session logging failed" });
    }
  });

  // --- Analytics Routes ---

  app.post("/api/analytics/track", async (req, res) => {
    try {
      const event = req.body;
      const docRef = db.collection("analytics").doc();
      await docRef.set({
        ...event,
        id: docRef.id,
        timestamp: new Date().toISOString()
      });
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Analytics tracking failed" });
    }
  });

  app.post("/api/analytics/visit", async (req, res) => {
    try {
      const visit = req.body;
      await db.collection("visits").add({
        ...visit,
        timestamp: new Date().toISOString()
      });
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Visit tracking failed" });
    }
  });

  // --- Admin Routes ---

  app.get("/api/admin/stats", authenticate, isAdmin, async (req, res) => {
    try {
      const users = await db.collection("users").get();
      const artisans = await db.collection("artisans").get();
      const products = await db.collection("products").get();
      const orders = await db.collection("orders").get();
      const visits = await db.collection("visits").get();

      const today = new Date().toISOString().split('T')[0];
      const visitsToday = visits.docs.filter((d: any) => d.data().timestamp.startsWith(today)).length;
      
      const revenue = orders.docs.reduce((acc: number, doc: any) => {
        const data = doc.data();
        return data.status === 'delivered' ? acc + (data.totalAmount || 0) : acc;
      }, 0);

      const popularPages = visits.docs.reduce((acc: any, doc: any) => {
        const path = doc.data().path;
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});

      const deviceBreakdown = visits.docs.reduce((acc: any, doc: any) => {
        const device = doc.data().device || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

      res.json({
        totalUsers: users.docs.length,
        activeUsersToday: visits.docs.filter((d: any) => d.data().timestamp.startsWith(today)).length, // Approximate
        newUsersToday: users.docs.filter((d: any) => d.data().createdAt?.startsWith(today)).length,
        totalArtisans: artisans.docs.length,
        pendingArtisans: artisans.docs.filter((d: any) => d.data().verificationStatus === 'pending').length,
        totalProducts: products.docs.length,
        totalOrders: orders.docs.length,
        pendingOrders: orders.docs.filter((d: any) => d.data().status === 'pending').length,
        totalRevenue: revenue,
        visitsToday,
        popularPages: Object.entries(popularPages).map(([path, count]) => ({ path, count: count as number })).sort((a: any, b: any) => b.count - a.count),
        deviceBreakdown: Object.entries(deviceBreakdown).map(([device, count]) => ({ device, count: count as number }))
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/activity", authenticate, isAdmin, async (req, res) => {
    try {
      const logs = await db.collection("activity_logs").get();
      res.json(logs.docs.map((d: any) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp)));
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  app.get("/api/admin/users", authenticate, isAdmin, async (req, res) => {
    try {
      const snapshot = await db.collection("users").get();
      res.json(snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/artisan/verify", authenticate, isAdmin, async (req: any, res) => {
    try {
      const { artisanId, status } = req.body;
      await db.collection("artisans").doc(artisanId).update({ verificationStatus: status });
      
      // If verified, update the user role effectively
      if (status === 'verified') {
        const artisan = await db.collection("artisans").doc(artisanId).get();
        const artisanData = artisan.data();
        const userSnapshot = await db.collection("users").where("email", "==", artisanData.email).get();
        if (userSnapshot.docs.length > 0) {
          await db.collection("users").doc(userSnapshot.docs[0].id).update({ role: 'artisan' });
        }
      }

      await logActivity({
        userId: req.user.id,
        role: "admin",
        activityType: "verify_artisan",
        activityMessage: `${status} artisan ${artisanId}`
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // --- Artisan Auth Routes ---

  app.post("/api/artisan/register", async (req, res) => {
    try {
      const { email, password, artisanName, craftType, phoneNumber, experience, location, bio } = req.body;
      
      const existing = await db.collection("artisans").where("email", "==", email).get();
      if (existing.docs.length > 0) return res.status(400).json({ error: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const artisanId = Math.random().toString(36).substring(7);
      
      const artisanData = {
        id: artisanId,
        email,
        password: hashedPassword,
        artisanName,
        craftType,
        phoneNumber,
        experience,
        location,
        bio,
        verificationStatus: "pending",
        createdAt: new Date().toISOString()
      };

      await db.collection("artisans").doc(artisanId).set(artisanData);
      
      // Also create a user record
      await db.collection("users").doc(artisanId).set({
        id: artisanId,
        email,
        displayName: artisanName,
        role: "artisan", // pending verification but role is set
        artisanId: artisanId,
        createdAt: new Date().toISOString()
      });

      await logActivity({
        userId: artisanId,
        role: "artisan",
        activityType: "register",
        activityMessage: "New artisan registered",
        username: artisanName
      });
      res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/artisan/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const snapshot = await db.collection("artisans").where("email", "==", email).get();
      if (snapshot.docs.length === 0) {
        await logActivity({
          userId: "anonymous",
          role: "artisan",
          activityType: "failed_login",
          activityMessage: `Failed login attempt for ${email} (User not found)`
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const artisan = snapshot.docs[0].data();
      const isValid = await bcrypt.compare(password, artisan.password);
      if (!isValid) {
        await logActivity({
            userId: artisan.id,
            role: "artisan",
            activityType: "failed_login",
            activityMessage: `Failed login attempt for ${email} (Wrong password)`
        });
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: artisan.id, email: artisan.email, role: "artisan" }, JWT_SECRET, { expiresIn: "7d" });
      
      await logActivity({
        userId: artisan.id,
        role: "artisan",
        activityType: "login",
        activityMessage: "Artisan logged in",
        username: artisan.artisanName
      });
      const { password: _, ...artisanPublic } = artisan;
      res.json({ token, artisan: artisanPublic });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/artisan/profile/update", authenticate, async (req: any, res) => {
    try {
      const { craftType, artisanBio, location } = req.body;
      const uid = req.user.id;

      // Update both users and artisans collection (legacy compat)
      await db.collection("users").doc(uid).update({ craftType });

      // Check if artisan doc exists, create if not
      const artisanRef = db.collection("artisans").doc(uid);
      const artisanDoc = await artisanRef.get();

      if (!artisanDoc.exists) {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();
        await artisanRef.set({
          id: uid,
          artisanName: userData?.displayName || "Unknown Artisan",
          craftType,
          artisanBio: artisanBio || "",
          location: location || "Mysuru",
          verificationStatus: "pending", // New artisans start as pending
          totalSales: 0,
          joinedDate: new Date().toISOString()
        });
      } else {
        await artisanRef.update({ craftType });
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Profile update failed" });
    }
  });

  app.get("/api/artisan/stats", authenticate, async (req: any, res) => {
    try {
      const artisanId = req.user.id;
      const products = await db.collection("products").where("artisanId", "==", artisanId).get();
      const orders = await db.collection("orders").where("artisanId", "==", artisanId).where("status", "==", "pending").get();
      
      res.json({
        activeProducts: products.docs.length,
        pendingOrders: orders.docs.length,
        totalSales: "₹" + (Math.floor(Math.random() * 50000) + 10000).toLocaleString() // Mocked for now
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // --- Product Routes ---

  app.get("/api/products/all", async (req, res) => {
    try {
      const { artisanId } = req.query;
      let snapshot;
      if (artisanId) {
        snapshot = await db.collection("products").where("artisanId", "==", artisanId).get();
      } else {
        snapshot = await db.collection("products").get();
      }
      const products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products/add", authenticate, async (req: any, res) => {
    try {
      const artisanId = req.user.id;
      const product = req.body;
      const docRef = db.collection("products").doc();
      const newProduct = {
        ...product,
        artisanId,
        id: docRef.id,
        price: "₹" + Number(product.price).toLocaleString(),
        stock: Number(product.stock),
        ratings: 5,
        reviewsCount: 0,
        createdAt: new Date().toISOString()
      };
      await docRef.set(newProduct);
      await logActivity({
        userId: artisanId,
        role: "artisan",
        activityType: "add_product",
        activityMessage: `Added product ${newProduct.productName}`,
        productId: docRef.id
      });
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/products/update/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.price) updates.price = "₹" + Number(updates.price).toLocaleString();
      await db.collection("products").doc(id).update(updates);
      res.json({ message: "Product updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/delete/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("products").doc(id).delete();
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // --- Order Routes ---

  app.get("/api/artisan/orders", authenticate, async (req: any, res) => {
    try {
      const artisanId = req.user.id;
      const snapshot = await db.collection("orders").where("artisanId", "==", artisanId).get();
      const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.put("/api/order/update-status/:id", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await db.collection("orders").doc(id).update({ status });
      res.json({ message: "Status updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.post("/api/orders/create", async (req, res) => {
    try {
      const orderData = req.body;
      const docRef = db.collection("orders").doc();
      const order = {
        ...orderData,
        id: docRef.id,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      await docRef.set(order);
      
      await logActivity({
        userId: orderData.customerId || "anonymous",
        role: "customer",
        activityType: "place_order",
        activityMessage: `Order placed for ${orderData.productName}`,
        productId: orderData.productId,
        username: orderData.customerName
      });
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: "Order failed" });
    }
  });

  // --- Planner Route (Existing) ---

  app.post("/api/plan-trip", async (req, res) => {
    try {
      const { days, budget, interests, foodPreference } = req.body;
      const prompt = `You are an expert Mysuru travel guide. Create a detailed ${days}-day itinerary for a traveler with a ${budget} budget. Interests: ${interests.join(", ")}. Food Preference: ${foodPreference}. Format the response as a structured JSON object with an array of days, each day having 'activities' (array of {time, title, location, description, estimatedCost}).`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error) {
      res.status(500).json({ error: "Failed to generate itinerary" });
    }
  });

  // --- Vlog Routes ---

  app.get("/api/vlogs/all", async (req, res) => {
    try {
      const snapshot = await db.collection("vlogs").get();
      const vlogs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json(vlogs.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)));
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch vlogs" });
    }
  });

  app.post("/api/vlogs/upload", async (req, res) => {
    try {
      const vlogData = req.body;
      const docRef = db.collection("vlogs").doc();
      const newVlog = {
        ...vlogData,
        id: docRef.id,
        likes: 0,
        shares: 0,
        views: 0,
        createdAt: new Date().toISOString()
      };
      await docRef.set(newVlog);
      
      const uploader = vlogData.uploaderId || "anonymous";
      await logActivity({
        userId: uploader,
        role: "traveler",
        activityType: "upload_vlog",
        activityMessage: `Uploaded vlog: ${newVlog.title}`,
        username: newVlog.creatorName
      });
      res.status(201).json(newVlog);
    } catch (err) {
      res.status(500).json({ error: "Vlog upload failed" });
    }
  });

  app.put("/api/vlogs/interaction/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body; // 'like', 'share', 'view'
      
      const vlogRef = db.collection("vlogs").doc(id);
      const vlog = await vlogRef.get();
      
      if (!vlog.exists) return res.status(404).json({ error: "Vlog not found" });
      
      const data = vlog.data();
      const updates: any = {};
      if (type === 'like') updates.likes = (data.likes || 0) + 1;
      if (type === 'share') updates.shares = (data.shares || 0) + 1;
      if (type === 'view') updates.views = (data.views || 0) + 1;
      
      await vlogRef.update(updates);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update interaction" });
    }
  });

  // --- Activity & Live Monitoring ---

  app.get("/api/admin/activities/stream", authenticate, isAdmin, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const onActivity = (activity: any) => {
      res.write(`data: ${JSON.stringify(activity)}\n\n`);
    };

    activityEmitter.on("new_activity", onActivity);

    req.on("close", () => {
      activityEmitter.removeListener("new_activity", onActivity);
    });
  });

  app.post("/api/track/activity", async (req, res) => {
    try {
      const data = req.body;
      await logActivity({
        ...data,
        timestamp: new Date().toISOString()
      });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: "Failed to track activity" });
    }
  });

  app.get("/api/admin/stats/live", authenticate, isAdmin, async (req, res) => {
    try {
      // Basic counts from various collections
      const [users, artisans, orders, vlogs, products, sessions] = await Promise.all([
        db.collection("users").get(),
        db.collection("artisans").get(),
        db.collection("orders").get(),
        db.collection("vlogs").get(),
        db.collection("products").get(),
        db.collection("sessions").get()
      ]);

      // Simple active users logic (last 24h activity)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentActivity = await db.collection("activity_logs")
        .where("timestamp", ">=", yesterday)
        .limit(100)
        .get();

      const activeUsersCount = new Set(recentActivity.docs.map(d => d.data().userId)).size;

      res.json({
        totalUsers: users.size,
        totalArtisans: artisans.size,
        totalOrders: orders.size,
        totalVlogs: vlogs.size,
        totalProducts: products.size,
        totalSessions: sessions.size,
        activeUsersToday: activeUsersCount,
        liveVisitors: Math.floor(Math.random() * 10) + 1 // Mock live visitors for now
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch live stats" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  createServer().then(app => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
