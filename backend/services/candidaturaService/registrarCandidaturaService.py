import models.candidaturaUsuario as c
import models.vagaProjeto as v
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import campoFaltando, texto


class RegistrarCandidaturaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["idVagaProjeto"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        vaga = v.buscarPorId(dados["idVagaProjeto"])

        if vaga is None:
            return {"erro": "Vaga nao encontrada"}, 404

        # Quem se candidata e sempre quem esta logado. Antes o id vinha no
        # corpo do pedido, e dava pra candidatar outra pessoa sem ela saber.
        idUsuario = idUsuarioLogado()

        if vaga.status != "aberta":
            return {"erro": "Essa vaga nao esta mais aberta"}, 409

        if v.getProjeto(vaga).criador_id == idUsuario:
            return {"erro": "Voce nao pode se candidatar ao seu proprio projeto"}, 409

        if c.buscarDoUsuarioNaVaga(idUsuario, vaga.id):
            return {"erro": "Voce ja se candidatou a essa vaga"}, 409

        candidatura = c.registrarCandidatura(
            texto(dados.get("mensagem"), 2000),
            vaga.id,
            idUsuario
        )

        return c.to_dict(candidatura), 201
