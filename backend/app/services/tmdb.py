import httpx
from app.core.config import settings

BASE_URL = "https://api.themoviedb.org/3"

async def tmdb_get(path: str, params: dict | None = None):
    if not settings.tmdb_api_key:
        return {"configured": False, "message": "TMDB_API_KEY is not configured.", "results": []}
    query = dict(params or {})
    query["api_key"] = settings.tmdb_api_key
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(f"{BASE_URL}{path}", params=query)
        response.raise_for_status()
        return response.json()
