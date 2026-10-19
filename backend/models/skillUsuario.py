from database.database import db

# O nivel vai de 1 a 4. O nome de cada um fica aqui pra tela nao precisar
# adivinhar o que o numero significa.
NIVEIS = {
    1: "Iniciante",
    2: "Intermediario",
    3: "Avancado",
    4: "Especialista"
}


class SkillUsuario(db.Model):
    __tablename__ = "skillUsuario"

    skills_id = db.Column(db.Integer, db.ForeignKey("skills.id"), primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), primary_key=True)
    nivel = db.Column(db.Integer, nullable=False, default=1)

    skills = db.relationship("Skills", back_populates="usuarios")
    usuario = db.relationship("Usuario", back_populates="skills")


def to_dict(self):
    return {
        "id": self.skills.id,
        "nome": self.skills.nome,
        "categoria": self.skills.categoria,
        "nivel": self.nivel,
        "nivelNome": nomeDoNivel(self.nivel)
    }

def nomeDoNivel(nivel):
    return NIVEIS.get(nivel, "Iniciante")

def nivelValido(nivel):
    return nivel in NIVEIS
