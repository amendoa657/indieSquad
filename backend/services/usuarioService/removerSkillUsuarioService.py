from repositories.skillUsuarioRepository import SkillUsuarioRepository
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from repositories.skillRepository import SkillRepository
from repositories.usuarioRepository import UsuarioRepository


class RemoverSkillUsuarioService:
    def execute(self, idUsuario, idSkill):
        usuario = UsuarioRepository.buscarPorId(idUsuario)
        skill = SkillRepository.buscarPorId(idSkill)

        if skill is None and usuario is None:
            return {"erro": "Função e pessoa não encontradas"}, 404

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        skillU = SkillUsuarioRepository.buscarVinculo(skill.id, usuario.id)

        # sem essa checagem o remover recebia None e derrubava a rota
        if skillU is None:
            return {"erro": "Você não tem essa função"}, 404

        UsuarioRepository.removerSkill(usuario, skillU)

        return {"mensagem": f"A função {skill.nome} foi removida"}, 200
