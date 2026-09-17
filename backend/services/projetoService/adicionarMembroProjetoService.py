import models.projetos as p
import models.usuario as u
from models.membroProjeto import MembroProjeto


class AdicionarMembroProjetoService:
    def execute(self, idProjeto, idUsuario):
        usuario = u.buscarPorId(idUsuario)
        projeto = p.buscarPorId(idProjeto)

        if projeto is None and usuario is None:
            return {"erro": "Projeto e usuarios nao encontrados"}, 404

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        for membro in projeto.membros:
            if membro.usuario.id == usuario.id:
                return {"erro": "Esse Usuario ja é membro do projeto"}, 409

        membro = MembroProjeto(
            projeto=projeto,
            usuario=usuario,
            cargo="MEMBRO"
        )

        return p.adicionarMembro(projeto, membro)
