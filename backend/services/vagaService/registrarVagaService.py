import models.vagaProjeto as v


class RegistrarVagaService:
    def execute(self, dados):
        titulo = dados["titulo"]
        descricao = dados["descricao"]
        status = dados["status"]
        idProjeto = dados["idProjeto"]
        idSkill = dados["idSkill"]

        v.registrarVagaProjeto(titulo, descricao, status, idProjeto, idSkill)

        return f"Vaga {titulo} registrada com sucesso"
