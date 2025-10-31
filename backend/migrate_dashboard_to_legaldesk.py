import os
import asyncio
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
SOURCE_DB = os.getenv("SOURCE_DB", "dashboard_etica")
TARGET_DB = os.getenv("TARGET_DB", "legaldesk")

COLLECTIONS: List[str] = [
    "clients",
    "cases",
    "documents",
    "appointments",
    "case_updates",
]

async def migrate_collection(src_col, tgt_col, key_fields: List[str]):
    migrated = 0
    # Use a batched cursor to avoid loading all docs in memory
    async for doc in src_col.find({}):
        # Build an upsert filter using first present key_field, fallback to _id
        filter_doc = None
        for k in key_fields:
            if k in doc:
                filter_doc = {k: doc[k]}
                break
        if filter_doc is None:
            filter_doc = {"_id": doc.get("_id")}
        # Upsert complete document
        await tgt_col.replace_one(filter_doc, doc, upsert=True)
        migrated += 1
    return migrated

async def main():
    print(f"Connecting to MongoDB at {MONGO_URL}")
    client = AsyncIOMotorClient(MONGO_URL)
    src = client[SOURCE_DB]
    tgt = client[TARGET_DB]

    print(f"Migrating from '{SOURCE_DB}' to '{TARGET_DB}'...")

    total_migrated = 0
    for name in COLLECTIONS:
        src_col = src[name]
        tgt_col = tgt[name]
        src_count = await src_col.count_documents({})
        print(f"- Collection '{name}': {src_count} documents to process")
        # Prefer business id fields when present
        key_fields = ["id"]  # our models include 'id' field
        migrated = await migrate_collection(src_col, tgt_col, key_fields)
        tgt_count = await tgt_col.count_documents({})
        print(f"  Migrated: {migrated} docs | Target count now: {tgt_count}")
        total_migrated += migrated

    print(f"Done. Total migrated documents: {total_migrated}")
    # Optional: show per-collection counts in target
    print("Target database counts:")
    for name in COLLECTIONS:
        tgt_count = await tgt[name].count_documents({})
        print(f"  {name}: {tgt_count}")

if __name__ == "__main__":
    asyncio.run(main())