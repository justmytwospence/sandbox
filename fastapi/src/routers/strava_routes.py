from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from models import get_db, User
import jwt
import requests
from starlette.config import Config

config = Config(".env")
JWT_SECRET = config("JWT_SECRET", cast=str, default="")

router = APIRouter(prefix="/api")


@router.get("/routes")
async def get_routes(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("jwt_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        strava_id = payload["strava_athlete_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.strava_id == strava_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    response = requests.get(
        "https://www.strava.com/api/v3/athlete/routes",
        headers={
            "Authorization": f"Bearer {user.access_token}"
        })
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code,
                            detail="Failed to fetch routes from Strava")

    routes = response.json()
    return routes
