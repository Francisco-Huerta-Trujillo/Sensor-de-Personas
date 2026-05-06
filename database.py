from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import DateTime


# Crear DB SQLite (archivo local)
DATABASE_URL = "sqlite:///./personas.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# Modelo (tabla)
class RegistroPersonas(Base):
    __tablename__ = "registros"

    id = Column(Integer, primary_key=True, index=True)
    people_count_all = Column(Integer)
    people_count_max = Column(Integer, nullable=True)
    region_count = Column(Integer)
    timestamp = Column(DateTime)
    
# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)