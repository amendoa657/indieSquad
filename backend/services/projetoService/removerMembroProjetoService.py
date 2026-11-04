from repositories.membroProjetoRepository import MembroProjetoRepository
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.projetoRepository import ProjetoRepository
from repositories.usuarioRepository import UsuarioRepository


class RemoverMembroProjetoService:
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

        membro = MembroProjetoRepository.buscarVinculo(projeto.id, usuario.id)

        # antes isso seguia pro remover com None e derrubava a rota
        if membro is None:
            return {"erro": "Essa pessoa não é membro do projeto"}, 404

        ProjetoRepository.removerMembro(projeto, membro)

        return {"mensagem": f"{usuario.usuario} saiu da equipe"}, 200
