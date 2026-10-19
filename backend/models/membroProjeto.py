from database.database import db
from sqlalchemy.sql import func



class MembroProjeto(db.Model):
    __tablename__ = "membroProjeto"

    projeto_id = db.Column(db.Integer, db.ForeignKey("projeto.id"), primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), primary_key=True)

    cargo = db.Column(db.String(30))
    dataEntrada = db.Column(db.DateTime, default=func.now())

    projeto = db.relationship("Projeto", back_populates="membros")
    usuario = db.relationship("Usuario", back_populates="participacoes")


def to_dict(self):
    return {
        "usuario_id": self.usuario_id,
        "projeto_id": self.projeto_id,
        "cargo": self.cargo,
        "dataEntrada": self.dataEntrada
    }

def buscarVinculo(idProjeto, idUsuario):
    return MembroProjeto.query.filter_by(
        projeto_id=idProjeto,
        usuario_id=idUsuario
    ).first()
