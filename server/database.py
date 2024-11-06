from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker  
from sqlalchemy.ext.declarative import declarative_base  
import os

# sqlite_db_file = "database.db" 
DATABASE_URL = "postgresql+pg8000://postgres.zmtahiowuduuoujdacdd:choncuonghoangquan@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# create sqlite engine instance
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL)

# create declarative base meta instance 
Base = declarative_base() 

# create session local class for ession maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False,bind=engine) 

