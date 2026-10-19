import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


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

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        skillU = SkillUsuario.query.filter_by(
            skills_id=skill.id,
            usuario_id=usuario.id
        ).first()

        # Antes isso ia direto pro remover e derrubava a rota quando o vinculo
        # nao existia.
        if skillU is None:
            return {"erro": "O usuario nao tem essa skill"}, 404

        u.removerSkill(usuario, skillU)

        return {"mensagem": f"A skill {skill.nome} foi removida com sucesso!"}, 200
