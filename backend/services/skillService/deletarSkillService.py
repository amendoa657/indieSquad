import models.skills as s


class DeletarSkillService:
    def execute(self, id):
        skill = s.buscarPorId(id)

        if skill is None:
            return {"erro": "Skill nao encontrado"}, 404

        if skill.vagas:
            return {"erro": "Essa skill esta em uso por uma vaga"}, 409

        nome = skill.nome
        s.deletarSkill(skill)

        return {"mensagem": f"Skill {nome} deletado com sucesso"}, 200
