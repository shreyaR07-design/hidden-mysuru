import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, "users")).then(() => {
  console.log("Client SDK Success");
  process.exit(0);
}).catch(err => {
  console.error("Client SDK Error:", err);
  process.exit(1);
});
