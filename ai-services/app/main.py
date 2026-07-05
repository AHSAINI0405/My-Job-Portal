from fastapi import FastAPI, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import base64
from pydantic import BaseModel
from app.resume_parser import extract_text_from_pdf
from app.matcher import match_resume_to_job
from app.routes.health import router as health_router

app = FastAPI(title="AI Services - Job Portal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

class AnalyzeRequest(BaseModel):
    resume_base64: str
    job_text: str

@app.post("/analyze")
async def analyze_resume(req: AnalyzeRequest):
    file_path = f"temp_resume_{os.urandom(4).hex()}.pdf"
    try:
        # Decode base64 and save as temp pdf
        b64_data = req.resume_base64
        if "," in b64_data:
            b64_data = b64_data.split(",")[1]
            
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(b64_data))

        # Extract text and run matching
        resume_text = extract_text_from_pdf(file_path)
        if not resume_text or not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        match_score = match_resume_to_job(resume_text, req.job_text)
        return {
            "match_percentage": match_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
