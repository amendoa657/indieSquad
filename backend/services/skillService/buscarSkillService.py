import models.skills as s


class BuscarSkillService:
    def execute(self, id):
        skill = s.getSkill(id)

        # antes isso passava None pro to_dict e derrubava a rota
        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        return s.to_dict(skill), 200
