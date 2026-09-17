import models.candidaturaUsuario as c


class AtualizarCandidaturaService:
    def execute(self, id, dados):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        if "mensagem" in dados:
            candidatura.mensagem = dados["mensagem"]

        if "status" in dados:
            candidatura.status = dados["status"]

        if "idVagaProjeto" in dados:
            candidatura.vagaProjeto_id = dados["idVagaProjeto"]

        if "idUsuario" in dados:
            candidatura.usuario_id = dados["idUsuario"]

        c.salvar()

        return "Candidatura alterada com sucesso", 200
