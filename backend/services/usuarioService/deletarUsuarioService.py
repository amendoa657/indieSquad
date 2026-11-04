from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from repositories.usuarioRepository import UsuarioRepository


class DeletarUsuarioService:
    def execute(self, id):
        usuario = UsuarioRepository.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(id):
            return ERRO_NAO_E_VOCE

        if usuario.projetosCriados:
            return {"erro": "Transfira ou apague seus projetos antes de apagar a conta"}, 409

        UsuarioRepository.deletarUsuario(usuario)

        return {"mensagem": "Conta apagada com sucesso"}, 200
