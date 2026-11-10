from app.core.config import settings

async def get_live_matches():
    if not settings.sports_api_key or not settings.sports_api_base_url:
        return {
            "configured": False,
            "message": "Configure SPORTS_API_KEY and SPORTS_API_BASE_URL for real football data.",
            "results": []
        }
    # Provider-specific implementation belongs here. Do not guess API endpoints:
    # consult the selected provider's current documentation and map its response.
    return {
        "configured": False,
        "message": "Sports provider credentials are present, but its adapter has not yet been implemented.",
        "results": []
    }
