import re

from database.database import db
from datetime import datetime, timedelta, timezone
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func

# Quantos dias depois de enviada a avaliacao e liberada mesmo que a outra
# pessoa nunca responda. Sem esse prazo, quem nao avalia ninguem conseguiria
# esconder pra sempre a avaliacao que recebeu.
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
    # A nota geral e a media das tres, arredondada. Fica gravada pronta pra
    # tela nao ter que recalcular toda vez que lista uma avaliacao.
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



# ---------------------------------------------------------------------
# Duplo-cego
# ---------------------------------------------------------------------
#
# Uma avaliacao fica escondida ate as duas pessoas enviarem a delas, ou ate
# passar o prazo.
#
# O problema que isso resolve: sem duplo-cego, quem avalia primeiro fica
# exposto. A outra pessoa le a nota que recebeu e responde na mesma moeda, e
# ai todo mundo aprende a dar nota alta pra nao levar nota baixa de volta. A
# reputacao inteira perde o sentido. Escondendo as duas ate as duas chegarem,
# ninguem avalia sabendo o que vai receber.

def liberada(avaliacao):
    # A reciproca existe: as duas pessoas ja se avaliaram nesse projeto.
    if buscarDoAvaliador(avaliacao.avaliado_id, avaliacao.avaliador_id, avaliacao.projeto_id):
        return True

    # Ou o prazo acabou e a outra pessoa nunca respondeu.
    if avaliacao.dataCriacao is None:
        return False

    limite = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=PRAZO_LIBERACAO_DIAS)

    return avaliacao.dataCriacao <= limite


def listarRecebidasLiberadas(idAvaliado):
    return [avaliacao for avaliacao in listarRecebidas(idAvaliado) if liberada(avaliacao)]



# A reputacao conta so o que ja foi liberado.
#
# Se avaliacao escondida entrasse na media, daria pra descobrir a nota pelo
# tanto que a media mexeu, e o duplo-cego nao serviria pra nada.
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
