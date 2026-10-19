import models.linkUsuario as l
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class RemoverLinkUsuarioService:
    def execute(self, idLink):
        link = l.buscarPorId(idLink)

        if link is None:
            return {"erro": "Link não encontrado"}, 404

        if not ehOProprio(link.usuario_id):
            return ERRO_NAO_E_VOCE

        l.removerLink(link)

        return {"mensagem": "Link removido"}, 200
