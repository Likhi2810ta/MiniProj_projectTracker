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
from auth_router import router as auth_router

from fastapi.openapi.utils import get_openapi

app = FastAPI(title="Project Tracker API", version="1.0.0")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title=app.title, version=app.version, routes=app.routes)
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {"type": "http", "scheme": "bearer"}
    }
    for path in schema.get("paths", {}).values():
        for op in path.values():
            op["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tracker_router)
app.include_router(chatbot_router)


@app.get("/health")
def health():
    return {"status": "ok"}
