from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

from models.membroProjeto import MembroProjeto

class Projeto(db.Model):
    __tablename__ = "projeto"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(90),  nullable=False)
    descricao = db.Column(MEDIUMTEXT, nullable=True)
    status = db.Column(db.String(90), nullable=False)
    dataCriacao = db.Column(db.DateTime, default=func.now())
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
        back_populates="projetoCriador"
    )



def to_dict(self):
    return {
        "id": self.id,
        "nome": self.nome,
        "status": self.status,
        "descricao": self.descricao,
        "dataCriacao": self.dataCriacao,
        "logoProjeto": self.logoProjeto,
        "criador_id": self.criador_id
    }

def buscarPorId(id):
    return db.session.get(Projeto, id)

def salvar():
    db.session.commit()



def mostrarProjeto(id):
    return Projeto.query.get(id)

def mostrarProjetos():
    return Projeto.query.all()



def registrarProjeto(nome, status, usuario_id, descricao, logoProjeto):
    ProjetoTable = Projeto(
        nome=nome,
        status=status,
        criador_id=usuario_id,
        descricao=descricao,
        logoProjeto=logoProjeto
    )

    db.session.add(ProjetoTable)
    salvar()

    return f"Projeto {nome} registrado com sucesso"

def removerProjeto(projeto):
    db.session.delete(projeto)
    salvar()

    return f"Projeto {projeto.nome} removido com sucesso!"



def getMembrosProjeto(projeto):
    return projeto.membros


def adicionarMembro(projeto, membro):
    projeto.membros.append(membro)
    salvar()
    return f"O membro {membro.usuario.usuario} foi adicionado com sucesso!"

def removerMembro(projeto, membro):
    projeto.membros.remove(membro)
    salvar()
    return f"O membro {membro.usuario.usuario} foi removido com sucesso!"

