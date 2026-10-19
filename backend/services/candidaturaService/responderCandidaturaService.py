import models.candidaturaUsuario as c
import models.projetos as p
from models.membroProjeto import MembroProjeto
from middlewares.validacao import campoFaltando
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


# o dono do projeto aceita ou recusa uma candidatura
class ResponderCandidaturaService:
    def execute(self, id, dados):
        faltando = campoFaltando(dados, ["status"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        status = dados["status"]

        if status not in ["aceita", "recusada"]:
            return {"erro": "A resposta deve ser aceita ou recusada"}, 400

        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        if candidatura.status != "pendente":
            return {"erro": "Essa candidatura já foi respondida"}, 409

        vaga = candidatura.projetoVaga
        projeto = p.buscarPorId(vaga.projeto_id)

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        candidatura.status = status

        if status == "aceita":
            if p.buscarMembro(projeto, candidatura.usuario_id) is None:
                membro = MembroProjeto(
                    projeto=projeto,
                    usuario=candidatura.candidato,
                    cargo=vaga.titulo[:30]
                )
                projeto.membros.append(membro)

            vaga.status = "preenchida"

            for outra in vaga.candidaturasUsuarios:
                if outra.id != candidatura.id and outra.status == "pendente":
                    outra.status = "recusada"

        c.salvar()

        return c.to_dict(candidatura), 200
