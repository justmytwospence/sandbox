from fastapi import APIRouter, Depends, Request
import jwt
from sqlalchemy.orm import Session
from starlette.config import Config
from datetime import datetime, timedelta
from models import User, get_db
from fastapi.responses import JSONResponse

config = Config(".env")
JWT_SECRET = config("JWT_SECRET", cast=str, default="")

router = APIRouter()


def create_jwt_token(token: dict) -> str:
    payload = {
        "strava_token": token["access_token"],
        "strava_athlete_id": token["athlete"]["id"],
        "exp": datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token


def create_user(token: dict, db: Session) -> User:
    strava_id = token["athlete"]["id"],
    existing_user = db.query(User).filter(User.strava_id == strava_id).first()
    if existing_user:
        return existing_user
    user = User(
        strava_id=strava_id,
        access_token=token["access_token"],
        refresh_token=token["refresh_token"],
        expires_at=token["expires_at"],
        jwt_token=create_jwt_token(token)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/check-token")
async def check_token(request: Request):
    token = request.cookies.get("jwt_token")
    if not token:
        return JSONResponse(status_code=401, content={
            "is_valid": False,
            "message": "Token is missing"
        })

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return JSONResponse(status_code=401, content={
            "is_valid": False,
            "message": "Token has expired"
        })
    except jwt.InvalidTokenError:
        return JSONResponse(status_code=401, content={
            "is_valid": False,
            "message": "Invalid token"
        })

    return JSONResponse(status_code=200, content={
        "is_valid": True,
        "message": "Token is valid",
        "payload": payload
    })
