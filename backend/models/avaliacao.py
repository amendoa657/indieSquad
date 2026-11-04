from database.database import db
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

# depois desse prazo a avaliacao libera mesmo sem a outra pessoa responder
PRAZO_LIBERACAO_DIAS = 14

NOTA_MINIMA = 1
NOTA_MAXIMA = 5


class Avaliacao(db.Model):
    __tablename__ = "avaliacao"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nota = db.Column(db.Integer, nullable=False)
    notaComunicacao = db.Column(db.Integer, nullable=False)
    notaPrazo = db.Column(db.Integer, nullable=False)
    notaQualidade = db.Column(db.Integer, nullable=False)
    comentario = db.Column(MEDIUMTEXT, nullable=True)
    dataCriacao = db.Column(db.DateTime, default=func.now())

    avaliador_id = db.Column(
        db.Integer,
        db.ForeignKey("usuario.id"),
        nullable=False
    )

    avaliador = db.relationship(
        "Usuario",
        back_populates="avaliacoesFeitas",
        foreign_keys=[avaliador_id]
    )


    avaliado_id = db.Column(
        db.Integer,
        db.ForeignKey("usuario.id"),
        nullable=False
    )

    avaliado = db.relationship(
        "Usuario",
        back_populates="avaliacoesRecebidas",
        foreign_keys=[avaliado_id]
    )


    projeto_id = db.Column(
        db.Integer,
        db.ForeignKey("projeto.id"),
        nullable=False
    )

    projeto = db.relationship(
        "Projeto",
        back_populates="avaliacoes"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "avaliador_id",
            "avaliado_id",
            "projeto_id",
            name="uq_avaliacao_avaliador_avaliado_projeto"
        ),
    )


def to_dict(self):
    return {
        "id": self.id,
        "nota": self.nota,
        "notaComunicacao": self.notaComunicacao,
        "notaPrazo": self.notaPrazo,
        "notaQualidade": self.notaQualidade,
        "comentario": self.comentario,
        "dataCriacao": self.dataCriacao,
        "avaliador_id": self.avaliador_id,
        "avaliado_id": self.avaliado_id,
        "projeto_id": self.projeto_id
    }


def notaValida(nota):
    try:
        numero = int(nota)
    except (TypeError, ValueError):
        return False

    return NOTA_MINIMA <= numero <= NOTA_MAXIMA
