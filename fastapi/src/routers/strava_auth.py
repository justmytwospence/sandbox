from fastapi import APIRouter, Depends, HTTPException, status
from starlette.requests import Request
from sqlalchemy.orm import Session
from models import User, get_db
from routers.auth import create_user
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi.responses import RedirectResponse
from starlette.config import Config

config = Config(".env")

CLIENT_ID = config("STRAVA_CLIENT_ID", cast=str, default="")
CLIENT_SECRET = config("STRAVA_CLIENT_SECRET", cast=str, default="")

router = APIRouter(prefix="/api")

oauth = OAuth()
oauth.register(
    name='strava',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url='https://www.strava.com/oauth/authorize',
    access_token_url='https://www.strava.com/oauth/token',
    redirect_uri='http://localhost:8000/auth',
    scope='read_all,activity:read_all',
    client_kwargs={'token_endpoint_auth_method': 'client_secret_post'}
)


@router.get("/login")
async def get_authorization_code(request: Request):
    """OAuth2 flow, step 1: have the user log into Strava to obtain an authorization code grant"""

    redirect_uri = request.url_for('auth')
    return await oauth.strava.authorize_redirect(request, redirect_uri)


@router.get('/auth')
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.strava.authorize_access_token(request)
    except OAuthError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error.error
        )

    user = create_user(token, db)

    response = RedirectResponse(url="http://localhost:3000/login")
    response.set_cookie(key="jwt_token",
                        value=user.jwt_token,
                        httponly=True,
                        samesite="Lax",
                        secure=False)
    return response
