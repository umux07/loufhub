from fastapi import APIRouter, Query
from app.services.tmdb import tmdb_get

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("/")
async def global_search(q: str = Query(..., min_length=1)):
    movies = await tmdb_get("/search/multi", {"query": q})
    # Music and sports search are provider adapters to be added when providers are selected.
    return {
        "query": q,
        "movies_and_people": movies.get("results", []) if isinstance(movies, dict) else [],
        "music": [],
        "sports": [],
        "notice": "Music and sports search require configured provider adapters."
    }
