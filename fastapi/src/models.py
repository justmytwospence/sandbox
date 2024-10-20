from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from starlette.config import Config

config = Config(".env")

DATABASE_URL = config("DATABASE_URL", cast=str, default="sqlite:///./app.db")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    strava_id = Column(Integer, unique=True, index=True)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    expires_at = Column(Integer, nullable=False)
    jwt_token = Column(String, nullable=False)


class StravaRoute(Base):
    __tablename__ = "strava_routes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    name = Column(String, nullable=False)
    distance = Column(Integer, nullable=False)
    elevation = Column(Integer, nullable=False)
    polyline = Column(String, nullable=False)
    start_lat = Column(Integer, nullable=False)
    start_lng = Column(Integer, nullable=False)
    end_lat = Column(Integer, nullable=False)
    end_lng = Column(Integer, nullable=False)


class StravaActivity(Base):
    __tablename__ = "strava_activities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    name = Column(String, nullable=False)
    distance = Column(Integer, nullable=False)
    moving_time = Column(Integer, nullable=False)
    total_elevation_gain = Column(Integer, nullable=False)
    start_date = Column(String, nullable=False)
    start_lat = Column(Integer, nullable=False)
    start_lng = Column(Integer, nullable=False)
    end_lat = Column(Integer, nullable=False)
    end_lng = Column(Integer, nullable=False)


Base.metadata.create_all(bind=engine)
