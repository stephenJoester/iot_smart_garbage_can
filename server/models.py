from sqlalchemy import Column, Integer, DateTime, String, Boolean
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import func
import enum

class Trash(Base) : 
    __tablename__ = "trash"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    label = Column(String, index=True) 
    detected_at = Column(DateTime, server_default=func.now())
    is_collected = Column(Boolean, default=False)
    