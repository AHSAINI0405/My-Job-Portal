import spacy
from pdfminer.high_level import extract_text

nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    return extract_text(file_path)

def extract_skills(text, skill_list):
    doc = nlp(text.lower())
    found_skills = []

    for skill in skill_list:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return list(set(found_skills))
