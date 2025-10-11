import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function recreateTTLIndex() {
  const client = new MongoClient(process.env.DATABASE_URL!);
  await client.connect();

  const db = client.db("Cluster0"); 
  const collection = db.collection("Otp");

  // Drop the old index
  try {
    await collection.dropIndex("createdAt_1");
    console.log("Old TTL index dropped!");
  } catch (err) {
    console.log("No existing index to drop or error:", err);
  }

  // Create new TTL index
  await collection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 900 } // 15 minutes
  );

  console.log("New TTL index created!");
  await client.close();
}

recreateTTLIndex().catch(err => console.error(err));
