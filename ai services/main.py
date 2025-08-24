from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import uvicorn

from config import (
    API_TITLE,
    API_DESCRIPTION,
    API_VERSION,
    ALLOWED_ORIGINS,
    DEFAULT_HOST,
    DEFAULT_PORT
)
from routes import router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {API_TITLE} v{API_VERSION}")
    logger.info("API documentation available at /docs")
    yield
    # Shutdown
    logger.info(f"Shutting down {API_TITLE}")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host=DEFAULT_HOST, 
        port=DEFAULT_PORT,
        reload=True
    )