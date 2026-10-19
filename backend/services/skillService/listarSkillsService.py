import models.skills as s


class ListarSkillsService:
    def execute(self):
        return [s.to_dict(skill) for skill in s.getSkills()], 200
