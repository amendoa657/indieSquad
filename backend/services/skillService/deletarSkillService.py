import models.skills as s


class DeletarSkillService:
    def execute(self, id):
        skill = s.buscarPorId(id)
        s.deletarSkill(skill)
        return f"Skill {skill.nome} deletado com sucesso"
