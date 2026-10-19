import models.projetos as p
from middlewares.validacao import texto
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class AtualizarProjetoService:
    def execute(self, id, dados):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if dados is None:
            return {"erro": "Nenhum dado foi enviado"}, 400

        if "nome" in dados:
            nome = texto(dados["nome"], 90)

            if not nome:
                return {"erro": "O nome não pode ficar vazio"}, 400

            projeto.nome = nome

        if "descricao" in dados:
            projeto.descricao = texto(dados["descricao"], 5000)

        if "status" in dados:
            if not p.statusValido(dados["status"]):
                return {"erro": "Status inválido"}, 400

            # concluir tem rota propria porque fecha as vagas e libera a avaliacao
            if dados["status"] == "concluido":
                return {"erro": "Use a rota de concluir projeto pra marcar como concluído"}, 400

            projeto.status = dados["status"]

        if "genero" in dados:
            projeto.genero = texto(dados["genero"], 45)

        if "engine" in dados:
            projeto.engine = texto(dados["engine"], 45)

        if "tipoParceria" in dados:
            projeto.tipoParceria = texto(dados["tipoParceria"], 45)

        if "duracaoEstimada" in dados:
            projeto.duracaoEstimada = texto(dados["duracaoEstimada"], 45)

        if "logoProjeto" in dados:
            projeto.logoProjeto = texto(dados["logoProjeto"], 255)

        p.salvar()

        return p.to_dict(projeto), 200
