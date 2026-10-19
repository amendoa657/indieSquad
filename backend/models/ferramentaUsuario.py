from database.database import db

class FerramentaUsuario(db.Model):
    __tablename__ = "ferramentaUsuario"

    ferramenta_id = db.Column(db.Integer, db.ForeignKey("ferramenta.id"), primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), primary_key=True)

    ferramenta = db.relationship("Ferramenta", back_populates="usuarios")
    usuario = db.relationship("Usuario", back_populates="ferramentas")


def to_dict(self):
    return {
        "id": self.ferramenta.id,
        "nome": self.ferramenta.nome,
        "categoria": self.ferramenta.categoria
    }
