from database.database import db

class Skills(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(90),  nullable=False, unique=True)
    categoria = db.Column(db.String(45), nullable=False, default="Outro")

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
        "nome": self.nome,
        "categoria": self.categoria
    }


def getSkillUsuarios(skill):
    return skill.usuarios
