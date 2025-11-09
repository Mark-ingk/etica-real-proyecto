import os
import asyncio
from typing import List, Tuple, Dict, Any

from motor.motor_asyncio import AsyncIOMotorClient


async def ensure_collection_indexes(collection, index_specs: List[Tuple[List[Tuple[str, int]], Dict[str, Any]]]):
    created = []
    for keys, options in index_specs:
        try:
            name = await collection.create_index(keys, **options)
            created.append(name)
        except Exception as e:
            print(f"[WARN] No se pudo crear índice {keys} en {collection.name}: {e}")
    return created


async def main():
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        print("[ERROR] MONGO_URL no está definido. Exporta la cadena de conexión de MongoDB.")
        print("Ejemplo PowerShell: $env:MONGO_URL=\"mongodb+srv://usuario:pass@host/\"")
        return

    db_name = os.environ.get("DB_NAME", "legaldesk")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    print(f"Conectado. Asegurando índices en base: {db_name}")

    index_map = {
        "clients": [
            ([("email", 1)], {"unique": True, "name": "clients_email_unique"}),
            ([("status", 1)], {"name": "clients_status_idx"}),
        ],
        "cases": [
            ([("client_id", 1)], {"name": "cases_client_id_idx"}),
            ([("status", 1)], {"name": "cases_status_idx"}),
        ],
        "appointments": [
            ([("client_id", 1)], {"name": "appointments_client_id_idx"}),
            ([("appointment_date", 1)], {"name": "appointments_date_idx"}),
        ],
        "documents": [
            ([("case_id", 1)], {"name": "documents_case_id_idx"}),
            ([("client_id", 1)], {"name": "documents_client_id_idx"}),
        ],
        "case_updates": [
            ([("case_id", 1)], {"name": "case_updates_case_id_idx"}),
            ([("client_id", 1)], {"name": "case_updates_client_id_idx"}),
            ([("is_visible_to_client", 1)], {"name": "case_updates_visible_idx"}),
        ],
    }

    for coll_name, specs in index_map.items():
        coll = db[coll_name]
        created = await ensure_collection_indexes(coll, specs)
        print(f"[{coll_name}] índices asegurados/creados: {created}")

    print("Listo. Si algún índice ya existía, MongoDB lo mantuvo sin duplicar.")


if __name__ == "__main__":
    asyncio.run(main())

