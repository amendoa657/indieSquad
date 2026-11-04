import models.skills as s
from repositories.skillRepository import SkillRepository


class ListarSkillsService:
    def execute(self):
        return [s.to_dict(skill) for skill in SkillRepository.getSkills()], 200
