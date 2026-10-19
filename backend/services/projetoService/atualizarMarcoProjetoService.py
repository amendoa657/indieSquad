import models.marcoProjeto as m
import models.projetos as p
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from middlewares.validacao import texto


class AtualizarMarcoProjetoService:
    def execute(self, idMarco, dados):
        marco = m.buscarPorId(idMarco)

        if marco is None:
            return {"erro": "Marco não encontrado"}, 404

        if not ehDonoDoProjeto(p.buscarPorId(marco.projeto_id)):
            return ERRO_NAO_E_DONO

        if dados is None:
            return {"erro": "Nenhum dado foi enviado"}, 400

        if "titulo" in dados:
            titulo = texto(dados["titulo"], 90)

            if not titulo:
                return {"erro": "O título não pode ficar vazio"}, 400

            marco.titulo = titulo

        if "concluido" in dados:
            marco.concluido = bool(dados["concluido"])

        m.salvar()

        return m.to_dict(marco), 200
