import models.skills as s


class AtualizarSkillService:
    def execute(self, id, dados):
        skill = s.buscarPorId(id)
        nome = dados["nome"]

        skill.nome = nome
        s.salvar()

        return f"Skill {nome} alterado com sucesso"
