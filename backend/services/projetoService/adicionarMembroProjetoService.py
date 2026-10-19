import models.projetos as p
import models.usuario as u
from models.membroProjeto import MembroProjeto
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class AdicionarMembroProjetoService:
    def execute(self, idProjeto, idUsuario):
        usuario = u.buscarPorId(idUsuario)
        projeto = p.buscarPorId(idProjeto)

        if projeto is None and usuario is None:
            return {"erro": "Projeto e pessoa não encontrados"}, 404

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if projeto.criador_id == usuario.id:
            return {"erro": "O criador já faz parte da equipe"}, 409

        for membro in projeto.membros:
            if membro.usuario.id == usuario.id:
                return {"erro": "Essa pessoa já é membro do projeto"}, 409

        membro = MembroProjeto(
            projeto=projeto,
            usuario=usuario,
            cargo="Membro"
        )

        p.adicionarMembro(projeto, membro)

        return {"mensagem": f"{usuario.usuario} entrou na equipe"}, 201
