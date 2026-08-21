import models.vagaProjeto as v


class AtualizarVagaService:
    def execute(self, id, dados):
        vaga = v.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga nao encontrado"}, 404

        if "titulo" in dados:
            vaga.titulo = dados["titulo"]

        if "descricao" in dados:
            vaga.descricao = dados["descricao"]

        if "status" in dados:
            vaga.status = dados["status"]

        if "idProjeto" in dados:
            vaga.projeto_id = dados["idProjeto"]

        if "idSkill" in dados:
            vaga.skills_id = dados["idSkill"]

        v.salvar()

        return "Vaga alterada com sucesso", 200
