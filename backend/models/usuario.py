from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

from models.membroProjeto import MembroProjeto



class Usuario(db.Model):
    __tablename__ = "usuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    usuario = db.Column(db.String(60),  nullable=False)
    email = db.Column(db.String(90), nullable=False, unique=True)
    senha = db.Column(db.String(90), nullable=False)
    bio = db.Column(MEDIUMTEXT, nullable=True)
    dataCriacao = db.Column(db.DateTime, default=func.now())
    fotoDePerfil = db.Column(db.String(255), nullable=True)

    projetosCriados = db.relationship(
        "Projeto",
        back_populates="criador"
    )

    participacoes = db.relationship(
        "MembroProjeto",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )

    skills = db.relationship(
        "SkillUsuario",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )


    candidaturas = db.relationship(
        "CandidaturaUsuario",
        back_populates="candidato"
    )


def to_dict(self):
    return {
        "id": self.id,
        "usuario": self.usuario,
        "email": self.email,
        "bio": self.bio,
        "dataCriacao": self.dataCriacao,
        "fotoDePerfil": self.fotoDePerfil
    }

def buscarPorId(id):
    return db.session.get(Usuario, id)

def salvar():
    db.session.commit()

def mostrarUsuario(id):
    return Usuario.query.get(id)

def mostrarUsuarios():
    return Usuario.query.all()

def registrarUsuario(usuario, email, senha):
    usuarioTable = Usuario(
        usuario=usuario,
        email=email,
        senha=senha
    )

    db.session.add(usuarioTable)
    salvar()

    return usuarioTable


def buscarPorEmail(email):
    return Usuario.query.filter_by(email=email).first()

def deletarUsuario(Usuario):
    db.session.delete(Usuario)
    salvar()


def getSkillsUsuario(usuario):
    return usuario.skills


def adicionarSkill(usuario, skill):
    usuario.skills.append(skill)
    salvar()

def removerSkill(usuario, skill):
    usuario.skills.remove(skill)
    salvar()