import os
from dotenv import load_dotenv

# Explicitly load .env before accessing variables
load_dotenv()

class Settings:
    """
    Centralized configuration object.

    All attributes are explicitly defined to avoid
    AttributeError during import-time access.
    """

    def __init__(self):
        self.SPOONACULAR_API_KEY: str | None = os.getenv("SPOONACULAR_API_KEY")
        self.SPOONACULAR_BASE_URL: str = os.getenv(
            "SPOONACULAR_BASE_URL",
            "https://api.spoonacular.com"
        )
        self.DATA_DIR: str = os.getenv("DATA_DIR", "app/storage")


# Instantiate ONCE
settings = Settings()
