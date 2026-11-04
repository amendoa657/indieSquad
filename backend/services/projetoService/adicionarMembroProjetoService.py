from models.membroProjeto import MembroProjeto
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.projetoRepository import ProjetoRepository
from repositories.usuarioRepository import UsuarioRepository


class AdicionarMembroProjetoService:
    def execute(self, idProjeto, idUsuario):
        usuario = UsuarioRepository.buscarPorId(idUsuario)
        projeto = ProjetoRepository.buscarPorId(idProjeto)

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

        ProjetoRepository.adicionarMembro(projeto, membro)

        return {"mensagem": f"{usuario.usuario} entrou na equipe"}, 201
