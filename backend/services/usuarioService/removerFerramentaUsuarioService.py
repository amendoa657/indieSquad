import models.usuario as u
import models.ferramenta as f
from models.ferramentaUsuario import FerramentaUsuario
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class RemoverFerramentaUsuarioService:
    def execute(self, idUsuario, idFerramenta):
        usuario = u.buscarPorId(idUsuario)
        ferramenta = f.buscarPorId(idFerramenta)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if ferramenta is None:
            return {"erro": "Ferramenta não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        vinculo = FerramentaUsuario.query.filter_by(
            ferramenta_id=ferramenta.id,
            usuario_id=usuario.id
        ).first()

        if vinculo is None:
            return {"erro": "Você não tem essa ferramenta"}, 404

        u.removerFerramenta(usuario, vinculo)

        return {"mensagem": f"A ferramenta {ferramenta.nome} foi removida"}, 200
