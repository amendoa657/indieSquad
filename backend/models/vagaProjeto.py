from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

class VagaProjeto(db.Model):
    __tablename__ = "vagaProjeto"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    titulo = db.Column(db.String(45),  nullable=False)
    descricao = db.Column(MEDIUMTEXT, nullable=True)
    status = db.Column(db.String(45),  nullable=False)
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



def to_dict(self):
    return {
        "id": self.id,
        "titulo": self.titulo,
        "descricao": self.descricao,
        "status": self.status,
        "dataCriacao": self.dataCriacao,
        "projeto_id": self.projeto_id,
        "skills_id": self.skills_id
    }

def buscarPorId(id):
    return db.session.get(VagaProjeto, id)

def salvar():
    db.session.commit()



def mostrarVagaProjeto(id):
    return VagaProjeto.query.get(id)

def mostrarVagaProjetos():
    return VagaProjeto.query.all()



def registrarVagaProjeto(titulo, descricao, status, idProjeto, idSkill):
    VagaProjetoTable = VagaProjeto(
        titulo=titulo,
        descricao=descricao,
        status=status,
        projeto_id=idProjeto,
        skills_id=idSkill
    )

    db.session.add(VagaProjetoTable)
    salvar()

    return f"Vaga de projeto registrada com sucesso"

def removerVagaProjeto(vagaProjeto):
    db.session.delete(vagaProjeto)
    salvar()

    return f"Vaga {vagaProjeto.titulo} removido com sucesso!"



def getProjeto(vagaProjeto):
    return vagaProjeto.projeto


