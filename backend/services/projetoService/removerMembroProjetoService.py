import models.projetos as p
import models.usuario as u
from models.membroProjeto import MembroProjeto


class RemoverMembroProjetoService:
    def execute(self, idProjeto, idUsuario):
        usuario = u.buscarPorId(idUsuario)
        projeto = p.buscarPorId(idProjeto)

        if projeto is None and usuario is None:
            return {"erro": "Projeto e usuarios nao encontrados"}, 404

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        membro = MembroProjeto.query.filter_by(
            projeto_id=projeto.id,
            usuario_id=usuario.id
        ).first()

        return p.removerMembro(projeto, membro)
