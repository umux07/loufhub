from fastapi import APIRouter
from app.services.sports import get_live_matches

router = APIRouter(prefix="/api/sports", tags=["sports"])

@router.get("/live")
async def live_matches():
    return await get_live_matches()

@router.get("/status")
async def sports_status():
    return {
        "module": "football",
        "features_planned": ["live scores", "fixtures", "results", "standings", "teams", "players", "statistics"],
        "note": "Connect a sports data provider to return real match information."
    }
