import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

async function run() {
  try {
    try {
      await signInWithEmailAndPassword(auth, "admin@mysuru.portal", "Admin@Portal@2024");
      console.log("Logged in");
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
         console.log("Creating user...");
         await createUserWithEmailAndPassword(auth, "admin@mysuru.portal", "Admin@Portal@2024");
         console.log("Created & Logged in");
      } else {
         throw e;
      }
    }
    
    // Now try to fetch
    await getDocs(collection(db, "users"));
    console.log("Success fetching users!");
    process.exit(0);

  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
run();
