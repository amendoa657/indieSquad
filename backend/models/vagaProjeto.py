from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

# "aberta" aceita candidatura, "preenchida" ja tem alguem, "fechada" foi
# encerrada junto com o projeto.
STATUS = ["aberta", "preenchida", "fechada"]


class VagaProjeto(db.Model):
    __tablename__ = "vagaProjeto"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    titulo = db.Column(db.String(45),  nullable=False)
    descricao = db.Column(MEDIUMTEXT, nullable=True)
    status = db.Column(db.String(45),  nullable=False)
    nivelMinimo = db.Column(db.Integer, nullable=True)
    dataCriacao = db.Column(db.DateTime, default=func.now())

    projeto_id = db.Column(
        db.Integer,
        db.ForeignKey("projeto.id"),
        nullable=False
    )

    projetoCriador = db.relationship(
        "Projeto",
        back_populates="vagas"
    )



    skills_id = db.Column(
        db.Integer,
        db.ForeignKey("skills.id"),
        nullable=False
    )

    skill = db.relationship(
        "Skills",
        back_populates="vagas"
    )


    candidaturasUsuarios = db.relationship(
        "CandidaturaUsuario",
        back_populates="projetoVaga",
        cascade="all, delete-orphan"
    )



def to_dict(self):
    return {
        "id": self.id,
        "titulo": self.titulo,
        "descricao": self.descricao,
        "status": self.status,
        "nivelMinimo": self.nivelMinimo,
        "dataCriacao": self.dataCriacao,
        "projeto_id": self.projeto_id,
        "skills_id": self.skills_id,
        "skillNome": self.skill.nome if self.skill else None
    }

def buscarPorId(id):
    return db.session.get(VagaProjeto, id)

def salvar():
    db.session.commit()

def statusValido(status):
    return status in STATUS



def mostrarVagaProjeto(id):
    return db.session.get(VagaProjeto, id)

def mostrarVagaProjetos():
    return VagaProjeto.query.all()

def listarPorProjeto(idProjeto):
    return VagaProjeto.query.filter_by(projeto_id=idProjeto).order_by(VagaProjeto.dataCriacao).all()



def registrarVagaProjeto(titulo, descricao, status, idProjeto, idSkill, nivelMinimo=None):
    VagaProjetoTable = VagaProjeto(
        titulo=titulo,
        descricao=descricao,
        status=status,
        nivelMinimo=nivelMinimo,
        projeto_id=idProjeto,
        skills_id=idSkill
    )

    db.session.add(VagaProjetoTable)
    salvar()

    return VagaProjetoTable

def removerVagaProjeto(vagaProjeto):
    db.session.delete(vagaProjeto)
    salvar()

    return f"Vaga {vagaProjeto.titulo} removido com sucesso!"



# O relacionamento da vaga com o projeto se chama projetoCriador. Antes essa
# funcao devolvia vagaProjeto.projeto, que nao existe, e quebrava.
def getProjeto(vagaProjeto):
    return vagaProjeto.projetoCriador
