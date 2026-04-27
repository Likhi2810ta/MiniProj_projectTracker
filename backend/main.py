"""
Project Tracker — FastAPI entry point.

Run locally:
    cd backend
    uvicorn main:app --reload --port 8000
"""

from dotenv import load_dotenv
load_dotenv()  # must happen before the router imports read env vars

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from project_tracker import router as tracker_router
from chatbot import router as chatbot_router

app = FastAPI(title="Project Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracker_router)
app.include_router(chatbot_router)


@app.get("/health")
def health():
    return {"status": "ok"}
