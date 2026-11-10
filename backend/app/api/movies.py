from fastapi import APIRouter, HTTPException, Query
from app.services.tmdb import tmdb_get

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/popular")
async def popular_movies(page: int = Query(1, ge=1)):
    try:
        return await tmdb_get("/movie/popular", {"page": page})
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"TMDB request failed: {exc}")

@router.get("/trending")
async def trending_movies():
    try:
        return await tmdb_get("/trending/movie/week")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"TMDB request failed: {exc}")

@router.get("/search")
async def search_movies(q: str = Query(..., min_length=1), page: int = Query(1, ge=1)):
    try:
        return await tmdb_get("/search/movie", {"query": q, "page": page})
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"TMDB request failed: {exc}")

@router.get("/{movie_id}")
async def movie_details(movie_id: int):
    try:
        return await tmdb_get(f"/movie/{movie_id}", {"append_to_response": "credits,videos,recommendations"})
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"TMDB request failed: {exc}")
