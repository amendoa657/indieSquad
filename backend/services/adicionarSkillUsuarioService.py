import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario


class AdicionarSkillUsuarioService:
    def execute(self, idUsuario, dados):
        usuario = u.buscarPorId(idUsuario)
        skill = s.buscarPorId(dados["idSkill"])
        nivel = int(dados["nivel"])

        if usuario is None and skill is None:
            return {"erro": "Usuario e skill nao encontrados"}, 404

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        if skill is None:
            return {"erro": "skill nao encontrado"}, 404

        for skillU in usuario.skills:
            if skillU.skills.id == skill.id:
                return {"erro": "O usuario ja tem essa skill"}, 409

        vinculo = SkillUsuario(
            skills=skill,
            usuario=usuario,
            nivel=nivel
        )

        u.adicionarSkill(usuario, vinculo)

        return f"A skill {skill.nome} foi adicionada com sucesso!"
