from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "LOUFHUB API"
    database_url: str = "sqlite:///./loufhub.db"
    tmdb_api_key: str = ""
    sports_api_key: str = ""
    sports_api_base_url: str = ""
    frontend_origin: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
