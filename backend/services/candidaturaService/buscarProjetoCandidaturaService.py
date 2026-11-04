import models.candidaturaUsuario as c
import models.projetos as p
from middlewares.autenticacao import idUsuarioLogado
from repositories.candidaturaRepository import CandidaturaRepository


class BuscarProjetoCandidaturaService:
    def execute(self, id):
        candidatura = CandidaturaRepository.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        # antes isso passava a VAGA pro to_dict de PROJETO e derrubava a rota
        projeto = c.getProjeto(candidatura)

        idLogado = idUsuarioLogado()

        if candidatura.usuario_id != idLogado and projeto.criador_id != idLogado:
            return {"erro": "Essa candidatura não é sua"}, 403

        return p.to_dict(projeto), 200
