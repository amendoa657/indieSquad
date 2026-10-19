import models.avaliacao as a
import models.projetos as p
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import campoFaltando, texto


class RegistrarAvaliacaoService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["idProjeto", "idAvaliado", "notaComunicacao", "notaPrazo", "notaQualidade"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        projeto = p.buscarPorId(dados["idProjeto"])

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        # a avaliacao so abre quando o projeto termina
        if projeto.status != "concluido":
            return {"erro": "Esse projeto ainda não foi concluído"}, 409

        idAvaliador = idUsuarioLogado()
        idAvaliado = int(dados["idAvaliado"])

        if idAvaliador == idAvaliado:
            return {"erro": "Você não pode avaliar a si mesmo"}, 409

        # so avalia quem esteve no mesmo projeto, e isso que faz a reputacao valer
        if not p.ehDaEquipe(projeto, idAvaliador):
            return {"erro": "Você não participou desse projeto"}, 403

        if not p.ehDaEquipe(projeto, idAvaliado):
            return {"erro": "Essa pessoa não participou desse projeto"}, 409

        if a.buscarDoAvaliador(idAvaliador, idAvaliado, projeto.id):
            return {"erro": "Você já avaliou essa pessoa nesse projeto"}, 409

        notas = {}
        for campo in ["notaComunicacao", "notaPrazo", "notaQualidade"]:
            if not a.notaValida(dados[campo]):
                return {"erro": f"A nota de {campo} deve ser de {a.NOTA_MINIMA} a {a.NOTA_MAXIMA}"}, 400

            notas[campo] = int(dados[campo])

        avaliacao = a.registrarAvaliacao(
            notas["notaComunicacao"],
            notas["notaPrazo"],
            notas["notaQualidade"],
            texto(dados.get("comentario"), 2000),
            idAvaliador,
            idAvaliado,
            projeto.id
        )

        return {
            "avaliacao": a.to_dict(avaliacao),
            "liberada": a.liberada(avaliacao),
            "mensagem": "Avaliação enviada. Ela fica escondida até a outra pessoa enviar a dela."
        }, 201
