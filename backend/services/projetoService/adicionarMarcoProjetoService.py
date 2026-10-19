import models.projetos as p
import models.marcoProjeto as m
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from middlewares.validacao import campoFaltando, texto

LIMITE_MARCOS = 10


class AdicionarMarcoProjetoService:
    def execute(self, idProjeto, dados):
        faltando = campoFaltando(dados, ["titulo"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        if len(projeto.marcos) >= LIMITE_MARCOS:
            return {"erro": f"O projeto pode ter no máximo {LIMITE_MARCOS} marcos"}, 409

        ordem = max([marco.ordem for marco in projeto.marcos], default=0) + 1
        marco = m.registrarMarco(texto(dados["titulo"], 90), ordem, projeto.id)

        return m.to_dict(marco), 201
