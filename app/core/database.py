
from functools import lru_cache

from supabase import Client, create_client

from app.core.config import settings


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """
    Create and cache the Supabase client.
    Credentials are loaded from environment configuration.
    """

    if not settings.SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured.")

    if not settings.SUPABASE_KEY:
        raise RuntimeError("SUPABASE_KEY is not configured.")

    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY,
    )
