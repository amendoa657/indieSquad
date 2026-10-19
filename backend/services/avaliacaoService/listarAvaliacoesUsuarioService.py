import models.avaliacao as a
import models.usuario as u


# as avaliacoes que uma pessoa recebeu, pro perfil dela
class ListarAvaliacoesUsuarioService:
    def execute(self, idUsuario):
        usuario = u.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        resultado = []
        for avaliacao in a.listarRecebidasLiberadas(usuario.id):
            dados = a.to_dict(avaliacao)
            dados["avaliador"] = u.to_dict(avaliacao.avaliador)
            dados["projeto"] = {
                "id": avaliacao.projeto.id,
                "nome": avaliacao.projeto.nome
            }
            resultado.append(dados)

        return {
            "reputacao": a.reputacao(usuario.id),
            "avaliacoes": resultado
        }, 200
