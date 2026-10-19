from database.database import db

class MarcoProjeto(db.Model):
    __tablename__ = "marcoProjeto"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    titulo = db.Column(db.String(90), nullable=False)
    concluido = db.Column(db.Boolean, nullable=False, default=False)
    ordem = db.Column(db.Integer, nullable=False, default=0)

    projeto_id = db.Column(
        db.Integer,
        db.ForeignKey("projeto.id"),
        nullable=False
    )

    projeto = db.relationship(
        "Projeto",
        back_populates="marcos"
    )


def to_dict(self):
    return {
        "id": self.id,
        "titulo": self.titulo,
        "concluido": self.concluido,
        "ordem": self.ordem,
        "projeto_id": self.projeto_id
    }

def buscarPorId(id):
    return db.session.get(MarcoProjeto, id)

def salvar():
    db.session.commit()

def registrarMarco(titulo, ordem, idProjeto):
    marcoTable = MarcoProjeto(
        titulo=titulo,
        ordem=ordem,
        projeto_id=idProjeto
    )

    db.session.add(marcoTable)
    salvar()

    return marcoTable

def removerMarco(marco):
    db.session.delete(marco)
    salvar()
