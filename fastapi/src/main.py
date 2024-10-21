import uvicorn
from fastapi import FastAPI
from routers import auth, strava_auth, strava_routes
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from starlette.config import Config

config = Config(".env")

SESSION_SECRET = config("SESSION_SECRET", cast=str, default="")

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://strava.spencerboucher.com",
    "https://strava.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    max_age=60 * 60 * 24 * 7  # one week, in seconds
)

app.include_router(strava_auth.router)
app.include_router(auth.router)
app.include_router(strava_routes.router)
# app.include_router(strava_activities.router)


# Run the API
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
