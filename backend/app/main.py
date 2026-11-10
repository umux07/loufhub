from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import movies, sports, search

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(sports.router)
app.include_router(search.router)

@app.get("/api/health", tags=["system"])
async def health():
    return {"status": "ok", "application": "LOUFHUB"}

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Welcome to LOUFHUB API", "docs": "/docs"}
