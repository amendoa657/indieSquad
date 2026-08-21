from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

class CandidaturaUsuario(db.Model):
    __tablename__ = "candidaturaUsuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    mensagem = db.Column(MEDIUMTEXT, nullable=True)
    status = db.Column(db.String(45),  nullable=False)
    dataCriacao = db.Column(db.DateTime, default=func.now())

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuario.id"),
        nullable=False
    )

    candidato = db.relationship(
        "Usuario",
        back_populates="candidaturas"
    )



    vagaProjeto_id = db.Column(
        db.Integer,
        db.ForeignKey("vagaProjeto.id"),
        nullable=False
    )

    projetoVaga = db.relationship(
        "VagaProjeto",
        back_populates="candidaturasUsuarios"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "usuario_id",
            "vagaProjeto_id",
            name="uq_candidatura_usuario_vaga"
        ),
    )



def to_dict(self):
    return {
        "id": self.id,
        "mensagem": self.mensagem,
        "status": self.status,
        "dataCriacao": self.dataCriacao,
        "vagaProjeto_id": self.vagaProjeto_id,
        "usuario_id": self.usuario_id
    }

def buscarPorId(id):
    return db.session.get(CandidaturaUsuario, id)

def salvar():
    db.session.commit()



def mostrarCandidatura(id):
    return CandidaturaUsuario.query.get(id)

def mostrarCandidaturas():
    return CandidaturaUsuario.query.all()



def registrarCandidatura(mensagem, status, idVagaProjeto, idUsuario):
    CandidaturaTable = CandidaturaUsuario(
        mensagem=mensagem,
        status=status,
        vagaProjeto_id=idVagaProjeto,
        usuario_id=idUsuario
    )

    db.session.add(CandidaturaTable)
    salvar()

def removerCandidatura(candidatura):
    db.session.delete(candidatura)
    salvar()



def getProjeto(candidatura):
    return candidatura.projetoVaga

