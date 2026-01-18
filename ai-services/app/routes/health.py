# health.py
# Used to check if AI service is alive

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "AI Service"
    }
