import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

async function run() {
  const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
  const app = getApps().length === 0 ? initializeApp({ projectId: config.projectId }) : getApps()[0];
  let db = getFirestore(app, config.firestoreDatabaseId);

  try {
     // A ping to see if we have access.
     await db.collection("ping").limit(1).get();
     console.log("Firebase Admin works!");
  } catch (err: any) {
     console.log("Firebase Admin failed, falling back to mock... error:", err.message);
  }
}
run();
