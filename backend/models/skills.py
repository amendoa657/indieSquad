from database.database import db

class Skills(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(90),  nullable=False)

    usuarios = db.relationship(
        "SkillUsuario",
        back_populates="skills",
        cascade="all, delete-orphan"
    )

    vagas = db.relationship(
        "VagaProjeto",
        back_populates="skill"
    )

def to_dict(self):
    return {
        "id": self.id,
        "nome": self.nome
    }

def buscarPorId(id):
    return db.session.get(Skills, id)

def salvar():
    db.session.commit()

def getSkill(id):
    return Skills.query.get(id)

def getSkills():
    return Skills.query.all()

def registrarSkill(nome):
    skillsTable = Skills(
        nome=nome
    )

    db.session.add(skillsTable)
    salvar()

    return skillsTable

def deletarSkill(skill):
    db.session.delete(skill)
    salvar()



def getSkillUsuarios(skill):
    return skill.usuarios

