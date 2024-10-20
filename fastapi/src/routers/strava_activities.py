from requests import Request
from fastapi import APIRouter, Depends, HTTPException
from models import User, get_db
from sqlalchemy.orm import Session
import jwt
from starlette.config import Config

config = Config(".env")
JWT_SECRET = config("JWT_SECRET", cast=str, default="")

router = APIRouter()


@router.get("/activities")
async def get_activities(request: Request, db: Session = Depends(get_db)):
    """Endpoint to fetch activities from Strava"""

    token = request.cookies.get("jwt_token")
    print(token)

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

    headers = {
        "Authorization": f"Bearer {user.access_token}"
    }
    response = requests.get(
        "https://www.strava.com/api/v3/athlete/activities", headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code,
                            detail="Failed to fetch activities from Strava")

    activities = response.json()
    return activities
