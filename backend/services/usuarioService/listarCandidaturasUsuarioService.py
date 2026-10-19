import models.candidaturaUsuario as c
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class ListarCandidaturasUsuarioService:
    def execute(self, idUsuario):
        # as candidaturas de uma pessoa sao dado privado dela
        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        candidaturas = c.listarPorUsuario(idUsuario)

        resultado = []
        for candidatura in candidaturas:
            vaga = candidatura.projetoVaga
            projeto = vaga.projetoCriador if vaga else None

            resultado.append({
                "id": candidatura.id,
                "mensagem": candidatura.mensagem,
                "status": candidatura.status,
                "dataCriacao": candidatura.dataCriacao,
                "vaga": {
                    "id": vaga.id,
                    "titulo": vaga.titulo,
                    "status": vaga.status
                } if vaga else None,
                "projeto": {
                    "id": projeto.id,
                    "nome": projeto.nome,
                    "status": projeto.status
                } if projeto else None
            })

        return resultado, 200
