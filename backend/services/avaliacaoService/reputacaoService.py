from datetime import datetime, timedelta, timezone

from models.avaliacao import PRAZO_LIBERACAO_DIAS
from repositories.avaliacaoRepository import AvaliacaoRepository


# Regras do duplo-cego e da reputacao. Ficam no Service porque sao regra de
# negocio: o Repository so entrega as avaliacoes, quem decide o que vale e aqui.
class ReputacaoService:

    @staticmethod
    def liberada(avaliacao):
        # a reciproca existe: as duas pessoas ja se avaliaram nesse projeto
        if AvaliacaoRepository.buscarDoAvaliador(
            avaliacao.avaliado_id, avaliacao.avaliador_id, avaliacao.projeto_id
        ):
            return True

        # ou o prazo acabou e a outra pessoa nunca respondeu
        if avaliacao.dataCriacao is None:
            return False

        limite = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=PRAZO_LIBERACAO_DIAS)

        return avaliacao.dataCriacao <= limite

    @staticmethod
    def listarRecebidasLiberadas(idAvaliado):
        return [
            avaliacao
            for avaliacao in AvaliacaoRepository.listarRecebidas(idAvaliado)
            if ReputacaoService.liberada(avaliacao)
        ]

    # a reputacao conta so o que ja foi liberado
    @staticmethod
    def reputacao(idAvaliado):
        avaliacoes = ReputacaoService.listarRecebidasLiberadas(idAvaliado)
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
