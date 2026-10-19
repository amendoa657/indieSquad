import models.projetos as p
import models.usuario as u
import models.skillUsuario as su
import models.avaliacao as a
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


# as candidaturas de um projeto, com os dados de cada candidato ja montados
class ListarCandidaturasProjetoService:
    def execute(self, idProjeto):
        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        resultado = []
        for vaga in projeto.vagas:
            for candidatura in vaga.candidaturasUsuarios:
                candidato = candidatura.candidato

                resultado.append({
                    "id": candidatura.id,
                    "mensagem": candidatura.mensagem,
                    "status": candidatura.status,
                    "dataCriacao": candidatura.dataCriacao,
                    "vaga": {
                        "id": vaga.id,
                        "titulo": vaga.titulo,
                        "status": vaga.status
                    },
                    "candidato": dict(
                        u.to_dict(candidato),
                        skills=[su.to_dict(skillU) for skillU in candidato.skills],
                        reputacao=a.reputacao(candidato.id)
                    )
                })

        resultado.sort(key=lambda item: item["dataCriacao"] or 0, reverse=True)

        return resultado, 200
