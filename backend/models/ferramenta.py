from database.database import db

class Ferramenta(db.Model):
    __tablename__ = "ferramenta"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nome = db.Column(db.String(90), nullable=False, unique=True)
    categoria = db.Column(db.String(45), nullable=False, default="Outro")

    usuarios = db.relationship(
        "FerramentaUsuario",
        back_populates="ferramenta",
        cascade="all, delete-orphan"
    )


def to_dict(self):
    return {
        "id": self.id,
        "nome": self.nome,
        "categoria": self.categoria
    }
