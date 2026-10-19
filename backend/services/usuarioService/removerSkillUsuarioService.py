import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class RemoverSkillUsuarioService:
    def execute(self, idUsuario, idSkill):
        usuario = u.buscarPorId(idUsuario)
        skill = s.buscarPorId(idSkill)

        if skill is None and usuario is None:
            return {"erro": "Função e pessoa não encontradas"}, 404

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        skillU = SkillUsuario.query.filter_by(
            skills_id=skill.id,
            usuario_id=usuario.id
        ).first()

        # sem essa checagem o remover recebia None e derrubava a rota
        if skillU is None:
            return {"erro": "Você não tem essa função"}, 404

        u.removerSkill(usuario, skillU)

        return {"mensagem": f"A função {skill.nome} foi removida"}, 200
