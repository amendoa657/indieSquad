import models.usuario as u
import models.skillUsuario as su


class ListarSkillsUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        return [su.to_dict(skillU) for skillU in u.getSkillsUsuario(usuario)], 200
