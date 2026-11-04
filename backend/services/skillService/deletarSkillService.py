from repositories.skillRepository import SkillRepository


class DeletarSkillService:
    def execute(self, id):
        skill = SkillRepository.buscarPorId(id)

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        if skill.vagas:
            return {"erro": "Essa função está em uso por uma vaga"}, 409

        nome = skill.nome
        SkillRepository.deletarSkill(skill)

        return {"mensagem": f"Função {nome} removida"}, 200
