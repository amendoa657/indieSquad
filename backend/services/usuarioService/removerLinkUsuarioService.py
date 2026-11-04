from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from repositories.linkUsuarioRepository import LinkUsuarioRepository


class RemoverLinkUsuarioService:
    def execute(self, idLink):
        link = LinkUsuarioRepository.buscarPorId(idLink)

        if link is None:
            return {"erro": "Link não encontrado"}, 404

        if not ehOProprio(link.usuario_id):
            return ERRO_NAO_E_VOCE

        LinkUsuarioRepository.removerLink(link)

        return {"mensagem": "Link removido"}, 200
