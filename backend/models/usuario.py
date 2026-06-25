import datetime

from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func



class Usuario(db.Model):
    __tablename__ = "usuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    usuario = db.Column(db.String(60),  nullable=False)
    email = db.Column(db.String(90), nullable=False, unique=True)
    senha = db.Column(db.String(90), nullable=False)
    bio = db.Column(MEDIUMTEXT, nullable=True)
    dataCriacao = db.Column(db.DateTime, default=func.now())
    fotoDePerfil = db.Column(db.String(255), nullable=True)
