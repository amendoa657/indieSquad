from repositories.ferramentaUsuarioRepository import FerramentaUsuarioRepository
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from repositories.ferramentaRepository import FerramentaRepository
from repositories.usuarioRepository import UsuarioRepository


class RemoverFerramentaUsuarioService:
    def execute(self, idUsuario, idFerramenta):
        usuario = UsuarioRepository.buscarPorId(idUsuario)
        ferramenta = FerramentaRepository.buscarPorId(idFerramenta)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if ferramenta is None:
            return {"erro": "Ferramenta não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        vinculo = FerramentaUsuarioRepository.buscarVinculo(ferramenta.id, usuario.id)

        if vinculo is None:
            return {"erro": "Você não tem essa ferramenta"}, 404

        UsuarioRepository.removerFerramenta(usuario, vinculo)

        return {"mensagem": f"A ferramenta {ferramenta.nome} foi removida"}, 200
