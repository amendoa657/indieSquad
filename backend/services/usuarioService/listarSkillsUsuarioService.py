import models.usuario as u
import models.skillUsuario as su
from repositories.usuarioRepository import UsuarioRepository


class ListarSkillsUsuarioService:
    def execute(self, id):
        usuario = UsuarioRepository.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        return [su.to_dict(skillU) for skillU in u.getSkillsUsuario(usuario)], 200
