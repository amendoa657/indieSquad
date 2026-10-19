import models.skills as s


class BuscarSkillService:
    def execute(self, id):
        skill = s.getSkill(id)

        # Antes isso passava None pro to_dict e derrubava a rota.
        if skill is None:
            return {"erro": "Skill nao encontrado"}, 404

        return s.to_dict(skill), 200
