import { Firestore } from "@google-cloud/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));

const db = new Firestore({
  projectId: config.projectId,
  databaseId: config.firestoreDatabaseId,
});

db.collection("test").limit(1).get().then(() => {
  console.log("Success with new Firestore()");
  process.exit(0);
}).catch((err) => {
  console.error("Error with new Firestore():", err.message);
  process.exit(1);
});
