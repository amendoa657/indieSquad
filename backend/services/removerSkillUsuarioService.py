import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario


class RemoverSkillUsuarioService:
    def execute(self, idUsuario, idSkill):
        usuario = u.buscarPorId(idUsuario)
        skill = s.buscarPorId(idSkill)

        if skill is None and usuario is None:
            return {"erro": "Skill e usuarios nao encontrados"}, 404

        if skill is None:
            return {"erro": "Skill nao encontrado"}, 404

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        skillU = SkillUsuario.query.filter_by(
            skills_id=skill.id,
            usuario_id=usuario.id
        ).first()

        u.removerSkill(usuario, skillU)

        return f"A skill {skill.nome} foi removida com sucesso!"
