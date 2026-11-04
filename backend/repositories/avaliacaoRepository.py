from database.database import db
from models.avaliacao import Avaliacao


class AvaliacaoRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(Avaliacao, id)

    @staticmethod
    def mostrarAvaliacoes():
        return Avaliacao.query.all()

    @staticmethod
    def listarRecebidas(idAvaliado):
        return (Avaliacao.query
                .filter_by(avaliado_id=idAvaliado)
                .order_by(Avaliacao.dataCriacao.desc())
                .all())

    @staticmethod
    def listarPorProjeto(idProjeto):
        return Avaliacao.query.filter_by(projeto_id=idProjeto).all()

    @staticmethod
    def buscarDoAvaliador(idAvaliador, idAvaliado, idProjeto):
        return Avaliacao.query.filter_by(
            avaliador_id=idAvaliador,
            avaliado_id=idAvaliado,
            projeto_id=idProjeto
        ).first()

    @staticmethod
    def registrarAvaliacao(nota, notaComunicacao, notaPrazo, notaQualidade,
                           comentario, idAvaliador, idAvaliado, idProjeto):
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
        AvaliacaoRepository.salvar()

        return avaliacaoTable

    @staticmethod
    def removerAvaliacao(avaliacao):
        db.session.delete(avaliacao)
        AvaliacaoRepository.salvar()
