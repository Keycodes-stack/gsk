
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.api.documents import router as documents_router
from app.core.config import settings
from app.api.research import router as research_router
from app.api.citations import router as citations_router

BASE_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DIR = BASE_DIR / "frontend"
FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
(FRONTEND_DIR / "css").mkdir(parents=True, exist_ok=True)
(FRONTEND_DIR / "js").mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    description="Research Intelligence & Decision Operating System API",
    version="1.0.0",
    debug=settings.DEBUG,
)

app.mount(
    "/css",
    StaticFiles(directory=FRONTEND_DIR / "css"),
    name="css",
)

app.mount(
    "/js",
    StaticFiles(directory=FRONTEND_DIR / "js"),
    name="js",
)


@app.get("/", include_in_schema=False)
async def root():
    return FileResponse(FRONTEND_DIR / "index.html")

app.include_router(documents_router, prefix="/api/v1")
app.include_router(citations_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "RID-OS Backend",
    }
app.include_router(research_router, prefix="/api/v1")
