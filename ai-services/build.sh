#!/bin/bash
# This script runs automatically before the app starts on Render.
# It downloads the spacy language model which is required for resume parsing.
python -m spacy download en_core_web_sm
