import models.linkUsuario as l
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from middlewares.validacao import campoFaltando, texto
from repositories.linkUsuarioRepository import LinkUsuarioRepository
from repositories.usuarioRepository import UsuarioRepository

LIMITE_LINKS = 6


class AdicionarLinkUsuarioService:
    def execute(self, idUsuario, dados):
        faltando = campoFaltando(dados, ["tipo", "url"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        usuario = UsuarioRepository.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        tipo = texto(dados["tipo"], 30).lower()
        url = texto(dados["url"], 255)

        if not l.tipoValido(tipo):
            return {"erro": "Tipo de link inválido"}, 400

        # sem https o link vira relativo e nao leva a lugar nenhum
        if not url.startswith("https://") and not url.startswith("http://"):
            return {"erro": "O link precisa começar com https://"}, 400

        if len(usuario.links) >= LIMITE_LINKS:
            return {"erro": f"Você pode ter no máximo {LIMITE_LINKS} links"}, 409

        for link in usuario.links:
            if link.url == url:
                return {"erro": "Esse link já está no seu perfil"}, 409

        link = LinkUsuarioRepository.registrarLink(tipo, url, usuario.id)

        return l.to_dict(link), 201
