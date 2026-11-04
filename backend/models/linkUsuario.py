from database.database import db

# os tipos de link que a tela conhece
TIPOS = ["github", "itchio", "artstation", "linkedin", "youtube", "twitter", "site", "outro"]


class LinkUsuario(db.Model):
    __tablename__ = "linkUsuario"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    tipo = db.Column(db.String(30), nullable=False)
    url = db.Column(db.String(255), nullable=False)

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuario.id"),
        nullable=False
    )

    usuario = db.relationship(
        "Usuario",
        back_populates="links"
    )


def to_dict(self):
    return {
        "id": self.id,
        "tipo": self.tipo,
        "url": self.url
    }


def tipoValido(tipo):
    return tipo in TIPOS
