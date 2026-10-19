import models.usuario as u
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class DeletarUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(id):
            return ERRO_NAO_E_VOCE

        if usuario.projetosCriados:
            return {"erro": "Transfira ou apague seus projetos antes de apagar a conta"}, 409

        u.deletarUsuario(usuario)

        return {"mensagem": "Conta apagada com sucesso"}, 200
