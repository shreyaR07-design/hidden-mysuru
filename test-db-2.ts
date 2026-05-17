import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = getApps().length === 0 ? initializeApp({ projectId: config.projectId }) : getApps()[0];

console.log("Config databaseId:", config.firestoreDatabaseId);

try {
  let db2 = getFirestore(app, config.firestoreDatabaseId);
  db2.collection("users").limit(1).get().then(() => {
    console.log("Success with getFirestore(app, databaseId)");
    process.exit(0);
  }).catch((err) => {
    console.error("Error with getFirestore:", err.message);
    process.exit(1);
  });
} catch (err: any) {
  console.error("Sync error:", err.message);
  process.exit(1);
}
