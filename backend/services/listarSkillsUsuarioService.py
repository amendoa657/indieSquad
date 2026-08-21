import models.usuario as u
import models.skills as s


class ListarSkillsUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        return [s.to_dict(skillU.skills) for skillU in u.getSkillsUsuario(usuario)]
