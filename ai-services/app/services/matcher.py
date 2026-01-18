from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_resume_to_job(resume_text, job_text):
    vectorizer = CountVectorizer().fit_transform([resume_text, job_text])
    vectors = vectorizer.toarray()

    similarity = cosine_similarity([vectors[0]], [vectors[1]])
    return round(similarity[0][0] * 100, 2)
