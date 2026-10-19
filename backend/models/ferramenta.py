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

def buscarPorId(id):
    return db.session.get(Ferramenta, id)

def salvar():
    db.session.commit()

def getFerramentas():
    return Ferramenta.query.order_by(Ferramenta.categoria, Ferramenta.nome).all()

def buscarPorNome(nome):
    return Ferramenta.query.filter_by(nome=nome).first()

def registrarFerramenta(nome, categoria="Outro"):
    ferramentaTable = Ferramenta(
        nome=nome,
        categoria=categoria
    )

    db.session.add(ferramentaTable)
    salvar()

    return ferramentaTable

def deletarFerramenta(ferramenta):
    db.session.delete(ferramenta)
    salvar()
