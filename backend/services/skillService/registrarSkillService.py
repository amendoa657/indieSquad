import models.skills as s


class RegistrarSkillService:
    def execute(self, dados):
        nome = dados["nome"]
        skill = s.registrarSkill(nome)

        return {
            "mensagem": f"Skill {nome} registrado com sucesso",
            "id": skill.id
        }, 201
