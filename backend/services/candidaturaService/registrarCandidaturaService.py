import models.candidaturaUsuario as c


class RegistrarCandidaturaService:
    def execute(self, dados):
        mensagem = dados["mensagem"]
        status = dados["status"]
        idVagaProjeto = dados["idVagaProjeto"]
        idUsuario = dados["idUsuario"]

        c.registrarCandidatura(mensagem, status, idVagaProjeto, idUsuario)

        return {"mensagem": "Candidatura registrada com sucesso"}, 201
