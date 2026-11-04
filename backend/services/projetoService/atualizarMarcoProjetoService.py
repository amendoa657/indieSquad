import models.marcoProjeto as m
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from middlewares.validacao import texto
from repositories.marcoProjetoRepository import MarcoProjetoRepository
from repositories.projetoRepository import ProjetoRepository


class AtualizarMarcoProjetoService:
    def execute(self, idMarco, dados):
        marco = MarcoProjetoRepository.buscarPorId(idMarco)

        if marco is None:
            return {"erro": "Marco não encontrado"}, 404

        if not ehDonoDoProjeto(ProjetoRepository.buscarPorId(marco.projeto_id)):
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

        MarcoProjetoRepository.salvar()

        return m.to_dict(marco), 200
