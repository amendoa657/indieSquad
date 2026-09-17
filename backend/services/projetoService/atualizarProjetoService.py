import models.projetos as p


class AtualizarProjetoService:
    def execute(self, id, dados):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        if "nome" in dados:
            projeto.nome = dados["nome"]

        if "descricao" in dados:
            projeto.descricao = dados["descricao"]

        if "status" in dados:
            projeto.status = dados["status"]

        if "logoProjeto" in dados:
            projeto.logoProjeto = dados["logoProjeto"]

        p.salvar()

        return "Projeto alterado com sucesso", 200
