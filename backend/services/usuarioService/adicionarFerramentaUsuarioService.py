import models.usuario as u
import models.ferramenta as f
import models.ferramentaUsuario as fu
from models.ferramentaUsuario import FerramentaUsuario
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from middlewares.validacao import campoFaltando

LIMITE_FERRAMENTAS = 12


class AdicionarFerramentaUsuarioService:
    def execute(self, idUsuario, dados):
        faltando = campoFaltando(dados, ["idFerramenta"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        usuario = u.buscarPorId(idUsuario)
        ferramenta = f.buscarPorId(dados["idFerramenta"])

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if ferramenta is None:
            return {"erro": "Ferramenta não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        for vinculo in usuario.ferramentas:
            if vinculo.ferramenta.id == ferramenta.id:
                return {"erro": "Você já tem essa ferramenta"}, 409

        if len(usuario.ferramentas) >= LIMITE_FERRAMENTAS:
            return {"erro": f"Você pode ter no máximo {LIMITE_FERRAMENTAS} ferramentas"}, 409

        vinculo = FerramentaUsuario(ferramenta=ferramenta, usuario=usuario)
        u.adicionarFerramenta(usuario, vinculo)

        return fu.to_dict(vinculo), 201
