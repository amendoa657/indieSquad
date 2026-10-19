import models.candidaturaUsuario as c
import models.projetos as p
from middlewares.autenticacao import idUsuarioLogado


class BuscarProjetoCandidaturaService:
    def execute(self, id):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura nao encontrada"}, 404

        # Antes isso passava a VAGA pro to_dict de PROJETO e derrubava a rota.
        # O caminho certo e candidatura -> vaga -> projeto.
        projeto = c.getProjeto(candidatura)

        idLogado = idUsuarioLogado()

        if candidatura.usuario_id != idLogado and projeto.criador_id != idLogado:
            return {"erro": "Essa candidatura nao e sua"}, 403

        return p.to_dict(projeto), 200
