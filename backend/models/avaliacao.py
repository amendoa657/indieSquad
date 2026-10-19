import re

from database.database import db
from datetime import datetime, timedelta, timezone
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

def buscarPorId(id):
    return db.session.get(Avaliacao, id)

def salvar():
    db.session.commit()

def notaValida(nota):
    try:
        numero = int(nota)
    except (TypeError, ValueError):
        return False

    return NOTA_MINIMA <= numero <= NOTA_MAXIMA



def mostrarAvaliacoes():
    return Avaliacao.query.all()

def listarRecebidas(idAvaliado):
    return Avaliacao.query.filter_by(avaliado_id=idAvaliado).order_by(Avaliacao.dataCriacao.desc()).all()

def listarPorProjeto(idProjeto):
    return Avaliacao.query.filter_by(projeto_id=idProjeto).all()

def buscarDoAvaliador(idAvaliador, idAvaliado, idProjeto):
    return Avaliacao.query.filter_by(
        avaliador_id=idAvaliador,
        avaliado_id=idAvaliado,
        projeto_id=idProjeto
    ).first()



def registrarAvaliacao(notaComunicacao, notaPrazo, notaQualidade, comentario, idAvaliador, idAvaliado, idProjeto):
    # a nota geral e a media das tres, arredondada
    nota = round((notaComunicacao + notaPrazo + notaQualidade) / 3)

    avaliacaoTable = Avaliacao(
        nota=nota,
        notaComunicacao=notaComunicacao,
        notaPrazo=notaPrazo,
        notaQualidade=notaQualidade,
        comentario=comentario,
        avaliador_id=idAvaliador,
        avaliado_id=idAvaliado,
        projeto_id=idProjeto
    )

    db.session.add(avaliacaoTable)
    salvar()

    return avaliacaoTable

def removerAvaliacao(avaliacao):
    db.session.delete(avaliacao)
    salvar()



# duplo-cego

def liberada(avaliacao):
    # a reciproca existe: as duas pessoas ja se avaliaram nesse projeto
    if buscarDoAvaliador(avaliacao.avaliado_id, avaliacao.avaliador_id, avaliacao.projeto_id):
        return True

    # ou o prazo acabou e a outra pessoa nunca respondeu
    if avaliacao.dataCriacao is None:
        return False

    limite = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=PRAZO_LIBERACAO_DIAS)

    return avaliacao.dataCriacao <= limite


def listarRecebidasLiberadas(idAvaliado):
    return [avaliacao for avaliacao in listarRecebidas(idAvaliado) if liberada(avaliacao)]



# a reputacao conta so o que ja foi liberado
def reputacao(idAvaliado):
    avaliacoes = listarRecebidasLiberadas(idAvaliado)
    total = len(avaliacoes)

    if total == 0:
        return {
            "total": 0,
            "media": 0,
            "mediaComunicacao": 0,
            "mediaPrazo": 0,
            "mediaQualidade": 0
        }

    def media(campo):
        return round(sum(getattr(avaliacao, campo) for avaliacao in avaliacoes) / total, 1)

    return {
        "total": total,
        "media": media("nota"),
        "mediaComunicacao": media("notaComunicacao"),
        "mediaPrazo": media("notaPrazo"),
        "mediaQualidade": media("notaQualidade")
    }
