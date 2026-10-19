import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import texto


# aqui o candidato edita a mensagem dele enquanto a candidatura esta pendente
class AtualizarCandidaturaService:
    def execute(self, id, dados):
        candidatura = c.buscarPorId(id)

        if candidatura is None:
            return {"erro": "Candidatura não encontrada"}, 404

        if candidatura.usuario_id != idUsuarioLogado():
            return {"erro": "Essa candidatura não é sua"}, 403

        if candidatura.status != "pendente":
            return {"erro": "Essa candidatura já foi respondida"}, 409

        if dados is None or "mensagem" not in dados:
            return {"erro": "Nenhum dado foi enviado"}, 400

        candidatura.mensagem = texto(dados["mensagem"], 2000)
        c.salvar()

        return c.to_dict(candidatura), 200
