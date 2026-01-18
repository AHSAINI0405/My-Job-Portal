# schema.py
# Used for request validation

from pydantic import BaseModel

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

class MatchResponse(BaseModel):
    score: float
    message: str
