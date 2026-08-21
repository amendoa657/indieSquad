import models.skills as s


class BuscarSkillService:
    def execute(self, id):
        skill = s.getSkill(id)
        return s.to_dict(skill)
