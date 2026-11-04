from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

from models.membroProjeto import MembroProjeto

# os status que um projeto pode ter
STATUS = ["ativo", "pausado", "concluido", "cancelado"]


class Projeto(db.Model):
    __tablename__ = "projeto"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(90),  nullable=False)
    descricao = db.Column(MEDIUMTEXT, nullable=True)
    status = db.Column(db.String(45), nullable=False)
    genero = db.Column(db.String(45), nullable=True)
    engine = db.Column(db.String(45), nullable=True)
    tipoParceria = db.Column(db.String(45), nullable=True)
    duracaoEstimada = db.Column(db.String(45), nullable=True)
    dataCriacao = db.Column(db.DateTime, default=func.now())
    dataConclusao = db.Column(db.DateTime, nullable=True)
    logoProjeto = db.Column(db.String(255), nullable=True)

    criador_id = db.Column(
        db.Integer,
        db.ForeignKey("usuario.id"),
        nullable=False
    )

    criador = db.relationship(
        "Usuario",
        back_populates="projetosCriados"
    )

    membros = db.relationship(
        "MembroProjeto",
        back_populates="projeto",
        cascade="all, delete-orphan"
    )

    vagas = db.relationship(
        "VagaProjeto",
        back_populates="projetoCriador",
        cascade="all, delete-orphan"
    )

    marcos = db.relationship(
        "MarcoProjeto",
        back_populates="projeto",
        cascade="all, delete-orphan",
        order_by="MarcoProjeto.ordem"
    )

    avaliacoes = db.relationship(
        "Avaliacao",
        back_populates="projeto",
        cascade="all, delete-orphan"
    )


def to_dict(self):
    return {
        "id": self.id,
        "nome": self.nome,
        "status": self.status,
        "descricao": self.descricao,
        "genero": self.genero,
        "engine": self.engine,
        "tipoParceria": self.tipoParceria,
        "duracaoEstimada": self.duracaoEstimada,
        "dataCriacao": self.dataCriacao,
        "dataConclusao": self.dataConclusao,
        "logoProjeto": self.logoProjeto,
        "criador_id": self.criador_id
    }


def statusValido(status):
    return status in STATUS


def getMembrosProjeto(projeto):
    return projeto.membros

# devolve o vinculo de membro de um usuario, ou None se ele nao e da equipe
def buscarMembro(projeto, idUsuario):
    for membro in projeto.membros:
        if membro.usuario_id == int(idUsuario):
            return membro

    return None

# o criador conta como parte da equipe, mesmo sem linha em membroProjeto
def ehDaEquipe(projeto, idUsuario):
    if projeto.criador_id == int(idUsuario):
        return True

    return buscarMembro(projeto, idUsuario) is not None


def getMarcosProjeto(projeto):
    return projeto.marcos
