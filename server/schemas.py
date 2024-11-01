from pydantic import BaseModel
from datetime import datetime

class TrashCreate(BaseModel):
    label: str

class Trash(BaseModel):
    id: int
    label: str
    detected_at: datetime
    is_collected : bool

    class Config:
        from_attributes = True
