import models.candidaturaUsuario as c


class ListarCandidaturasUsuarioService:
    def execute(self, idUsuario):
        candidaturas = c.CandidaturaUsuario.query.filter_by(usuario_id=idUsuario).all()

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
                    "titulo": vaga.titulo
                } if vaga else None,
                "projeto": {
                    "id": projeto.id,
                    "nome": projeto.nome
                } if projeto else None
            })

        return resultado, 200
