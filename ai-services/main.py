from fastapi import FastAPI, UploadFile
from resume_parser import extract_text_from_pdf
from matcher import match_resume_to_job

app = FastAPI()

@app.post("/match")
async def match_resume(file: UploadFile, job_description: str):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(file_path)
    match_score = match_resume_to_job(resume_text, job_description)

    return {
        "match_percentage": match_score
    }
