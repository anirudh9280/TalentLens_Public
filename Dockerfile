# TalentLens FastAPI backend image.
# models/talentlens-cross-encoder-sft-v1/ and chroma_store/ are committed in git and copied via COPY.
# all-MiniLM-L6-v2 (sentence-transformers) is prefetched at build time for offline SearchEngine startup.

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    TOKENIZERS_PARALLELISM=false

# System deps from repo recon:
#   tesseract-ocr — pipeline OCR (pytesseract); optional for API but used in the stack
#   libgomp1 — OpenMP for torch / faiss-cpu wheels on slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt -r backend/requirements.txt

# SearchEngine loads all-MiniLM-L6-v2 with local_files_only=True; cache it in the image.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
