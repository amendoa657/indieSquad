import models.projetos as p
import models.usuario as u
from models.membroProjeto import MembroProjeto
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


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

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if projeto.criador_id == usuario.id:
            return {"erro": "O criador ja faz parte da equipe"}, 409

        for membro in projeto.membros:
            if membro.usuario.id == usuario.id:
                return {"erro": "Esse Usuario ja e membro do projeto"}, 409

        membro = MembroProjeto(
            projeto=projeto,
            usuario=usuario,
            cargo="Membro"
        )

        p.adicionarMembro(projeto, membro)

        return {"mensagem": f"O membro {usuario.usuario} foi adicionado com sucesso!"}, 201
