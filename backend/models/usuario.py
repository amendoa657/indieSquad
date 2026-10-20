import re

from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

from models.membroProjeto import MembroProjeto

# o que a pessoa veio fazer aqui
OBJETIVOS = ["montarEquipe", "entrarProjeto", "ambos"]

# o handle e o apelido que aparece na URL do perfil
FORMATO_HANDLE = re.compile(r"^[a-z0-9_]{3,30}$")

TAMANHO_MINIMO_SENHA = 8

# as cores que a pessoa pode escolher pro proprio perfil: as cinco da paleta
# (uma por area do catalogo). Sem escolha, o perfil usa a cor da funcao principal
CORES_PERFIL = ["arte", "audio", "design", "producao", "programacao"]



class Usuario(db.Model):
    __tablename__ = "usuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    handle = db.Column(db.String(30), nullable=False, unique=True)
    usuario = db.Column(db.String(60),  nullable=False)
    email = db.Column(db.String(90), nullable=False, unique=True)
    senha = db.Column(db.String(255), nullable=False)
    bio = db.Column(MEDIUMTEXT, nullable=True)
    objetivo = db.Column(db.String(45), nullable=False, default="ambos")
    disponibilidadeHoras = db.Column(db.Integer, nullable=True)
    aceitaPortfolio = db.Column(db.Boolean, nullable=False, default=False)
    aceitaRevenueShare = db.Column(db.Boolean, nullable=False, default=False)
    aceitaRemunerado = db.Column(db.Boolean, nullable=False, default=False)
    dataCriacao = db.Column(db.DateTime, default=func.now())
    fotoDePerfil = db.Column(db.String(255), nullable=True)
    corPerfil = db.Column(db.String(20), nullable=True)

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

    ferramentas = db.relationship(
        "FerramentaUsuario",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )

    links = db.relationship(
        "LinkUsuario",
        back_populates="usuario",
        cascade="all, delete-orphan"
    )


    candidaturas = db.relationship(
        "CandidaturaUsuario",
        back_populates="candidato"
    )

    avaliacoesRecebidas = db.relationship(
        "Avaliacao",
        back_populates="avaliado",
        foreign_keys="Avaliacao.avaliado_id"
    )

    avaliacoesFeitas = db.relationship(
        "Avaliacao",
        back_populates="avaliador",
        foreign_keys="Avaliacao.avaliador_id"
    )


# o to_dict publico nunca devolve email nem senha
def to_dict(self):
    return {
        "id": self.id,
        "handle": self.handle,
        "usuario": self.usuario,
        "bio": self.bio,
        "objetivo": self.objetivo,
        "disponibilidadeHoras": self.disponibilidadeHoras,
        "aceitaPortfolio": self.aceitaPortfolio,
        "aceitaRevenueShare": self.aceitaRevenueShare,
        "aceitaRemunerado": self.aceitaRemunerado,
        "dataCriacao": self.dataCriacao,
        "fotoDePerfil": self.fotoDePerfil,
        "corPerfil": self.corPerfil
    }

# esse so e usado quando a pessoa pede os proprios dados
def to_dictCompleto(self):
    dados = to_dict(self)
    dados["email"] = self.email
    dados["perfilCompleto"] = percentualCompleto(self)
    dados["faltando"] = itensFaltando(self)

    return dados

def buscarPorId(id):
    return db.session.get(Usuario, id)

def salvar():
    db.session.commit()

def mostrarUsuario(id):
    return db.session.get(Usuario, id)

def mostrarUsuarios():
    return Usuario.query.all()

# a senha chega em texto e sai daqui como hash
def registrarUsuario(handle, usuario, email, senha):
    usuarioTable = Usuario(
        handle=handle,
        usuario=usuario,
        email=email,
        senha=generate_password_hash(senha)
    )

    db.session.add(usuarioTable)
    salvar()

    return usuarioTable

def definirSenha(usuario, senha):
    usuario.senha = generate_password_hash(senha)
    salvar()

def senhaCorreta(usuario, senha):
    return check_password_hash(usuario.senha, senha)


def buscarPorEmail(email):
    return Usuario.query.filter_by(email=email).first()

def buscarPorHandle(handle):
    return Usuario.query.filter_by(handle=handle).first()

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


def getFerramentasUsuario(usuario):
    return usuario.ferramentas

def adicionarFerramenta(usuario, ferramenta):
    usuario.ferramentas.append(ferramenta)
    salvar()

def removerFerramenta(usuario, ferramenta):
    usuario.ferramentas.remove(ferramenta)
    salvar()


def getLinksUsuario(usuario):
    return usuario.links


# o que conta como perfil completo
ITENS_PERFIL = [
    ("bio", "Escrever uma bio"),
    ("skills", "Adicionar pelo menos uma funcao"),
    ("disponibilidade", "Dizer sua disponibilidade"),
    ("colaboracao", "Marcar o tipo de colaboracao que aceita"),
    ("ferramentas", "Adicionar as ferramentas que voce usa"),
    ("links", "Add um link de portfolio"),
]


def itensFaltando(usuario):
    faltando = []

    if not (usuario.bio or "").strip():
        faltando.append("bio")

    if not usuario.skills:
        faltando.append("skills")

    if not usuario.disponibilidadeHoras:
        faltando.append("disponibilidade")

    if not (usuario.aceitaPortfolio or usuario.aceitaRevenueShare or usuario.aceitaRemunerado):
        faltando.append("colaboracao")

    if not usuario.ferramentas:
        faltando.append("ferramentas")

    if not usuario.links:
        faltando.append("links")

    return faltando


def percentualCompleto(usuario):
    faltando = len(itensFaltando(usuario))
    total = len(ITENS_PERFIL)

    return round(((total - faltando) / total) * 100)


def corPerfilValida(cor):
    return cor in CORES_PERFIL

def objetivoValido(objetivo):
    return objetivo in OBJETIVOS

def handleValido(handle):
    return bool(FORMATO_HANDLE.match(handle or ""))

def senhaForte(senha):
    return len(senha or "") >= TAMANHO_MINIMO_SENHA
