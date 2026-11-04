import models.candidaturaUsuario as c
import models.vagaProjeto as v
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import campoFaltando, texto
from repositories.candidaturaRepository import CandidaturaRepository
from repositories.vagaProjetoRepository import VagaProjetoRepository


class RegistrarCandidaturaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["idVagaProjeto"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        vaga = VagaProjetoRepository.buscarPorId(dados["idVagaProjeto"])

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        # quem se candidata e sempre quem esta logado
        idUsuario = idUsuarioLogado()

        if vaga.status != "aberta":
            return {"erro": "Essa vaga não está mais aberta"}, 409

        if v.getProjeto(vaga).criador_id == idUsuario:
            return {"erro": "Você não pode se candidatar ao seu próprio projeto"}, 409

        if CandidaturaRepository.buscarDoUsuarioNaVaga(idUsuario, vaga.id):
            return {"erro": "Você já se candidatou a essa vaga"}, 409

        candidatura = CandidaturaRepository.registrarCandidatura(
            texto(dados.get("mensagem"), 2000),
            vaga.id,
            idUsuario
        )

        return c.to_dict(candidatura), 201
