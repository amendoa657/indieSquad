from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

STATUS = ["pendente", "aceita", "recusada"]


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

def statusValido(status):
    return status in STATUS



def mostrarCandidatura(id):
    return db.session.get(CandidaturaUsuario, id)

def mostrarCandidaturas():
    return CandidaturaUsuario.query.all()

def listarPorUsuario(idUsuario):
    return CandidaturaUsuario.query.filter_by(usuario_id=idUsuario).order_by(CandidaturaUsuario.dataCriacao.desc()).all()

def listarPorVaga(idVaga):
    return CandidaturaUsuario.query.filter_by(vagaProjeto_id=idVaga).all()

def buscarDoUsuarioNaVaga(idUsuario, idVaga):
    return CandidaturaUsuario.query.filter_by(usuario_id=idUsuario, vagaProjeto_id=idVaga).first()



# O status nunca vem do front: toda candidatura nasce pendente.
def registrarCandidatura(mensagem, idVagaProjeto, idUsuario):
    CandidaturaTable = CandidaturaUsuario(
        mensagem=mensagem,
        status="pendente",
        vagaProjeto_id=idVagaProjeto,
        usuario_id=idUsuario
    )

    db.session.add(CandidaturaTable)
    salvar()

    return CandidaturaTable

def removerCandidatura(candidatura):
    db.session.delete(candidatura)
    salvar()



def getProjeto(candidatura):
    return candidatura.projetoVaga.projetoCriador
