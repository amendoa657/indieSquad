import models.avaliacao as a
import models.projetos as p
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import campoFaltando, texto


class RegistrarAvaliacaoService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["idProjeto", "idAvaliado", "notaComunicacao", "notaPrazo", "notaQualidade"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        projeto = p.buscarPorId(dados["idProjeto"])

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        # A avaliacao so abre quando o projeto termina. Enquanto o trabalho
        # esta rolando, nota vira pressao, nao informacao.
        if projeto.status != "concluido":
            return {"erro": "Esse projeto ainda nao foi concluido"}, 409

        idAvaliador = idUsuarioLogado()
        idAvaliado = int(dados["idAvaliado"])

        if idAvaliador == idAvaliado:
            return {"erro": "Voce nao pode avaliar a si mesmo"}, 409

        # Essa e a regra que faz a reputacao valer alguma coisa: so avalia
        # quem esteve no mesmo projeto que a pessoa.
        if not p.ehDaEquipe(projeto, idAvaliador):
            return {"erro": "Voce nao participou desse projeto"}, 403

        if not p.ehDaEquipe(projeto, idAvaliado):
            return {"erro": "Essa pessoa nao participou desse projeto"}, 409

        if a.buscarDoAvaliador(idAvaliador, idAvaliado, projeto.id):
            return {"erro": "Voce ja avaliou essa pessoa nesse projeto"}, 409

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
            "mensagem": "Avaliacao enviada. Ela fica escondida ate a outra pessoa enviar a dela."
        }, 201
