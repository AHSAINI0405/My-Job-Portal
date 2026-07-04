from fastapi import FastAPI, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from app.resume_parser import extract_text_from_pdf
from app.matcher import match_resume_to_job
from app.routes.health import router as health_router

app = FastAPI(title="AI Services - Job Portal")

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)

@app.post("/match")
async def match_resume(file: UploadFile, job_description: str = Form(...)):
    file_path = f"temp_{file.filename}"
    try {
        # Save temp file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Extract text and run matching
        resume_text = extract_text_from_pdf(file_path)
        if not resume_text or not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        match_score = match_resume_to_job(resume_text, job_description)
        return {
            "match_percentage": match_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass

