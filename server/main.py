from database import SessionLocal
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
import schemas
import models
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date as date_type

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db() : 
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/trash/", response_model=schemas.Trash)
def create_trash(trash: schemas.TrashCreate, db: Session = Depends(get_db)):
    try:
        classes = ['paper', 'plastic', 'metal','other']
        label = trash.label
        db_trash = models.Trash(label=classes[int(label)])
        db.add(db_trash)
        db.commit()
        db.refresh(db_trash)
        return db_trash
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trash/all", response_model=List[schemas.Trash])
def list_trash(date: Optional[date_type] = Query(None), db: Session = Depends(get_db)):
    try:
        query = db.query(models.Trash)
        
        # Filter by date if provided
        if date:
            start_datetime = datetime.combine(date, datetime.min.time())
            end_datetime = datetime.combine(date, datetime.max.time())
            query = query.filter(models.Trash.detected_at >= start_datetime, models.Trash.detected_at <= end_datetime)
        
        trash_items = query.all()
        return trash_items
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/trash/full")
def report_trash_full(db: Session = Depends(get_db)):
    try:
        new_notification = models.TrashFullNotification(message="The bin is full!")
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)
        return {"message": "Trash full notification recorded."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/trash/empty")
def empty_trash(db: Session = Depends(get_db)):
    try:
        notification = models.TrashFullNotification(
            message="The bin is empty!",
            is_full=False
        )
        db.add(notification)
        db.query(models.Trash).filter(models.Trash.is_collected == False).update(
            {models.Trash.is_collected: True}, synchronize_session=False
        )        
        db.commit()
        return {"message": "The bin has been emptied."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))