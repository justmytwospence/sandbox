from pydantic import BaseModel
from typing import Optional

class StravaRouteSchema(BaseModel):
    id: int
    name: str
    distance: Optional[int]
    map: str

    class Config:
        orm_mode = True