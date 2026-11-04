import models.avaliacao as a
import models.usuario as u
from repositories.usuarioRepository import UsuarioRepository
from services.avaliacaoService.reputacaoService import ReputacaoService


# as avaliacoes que uma pessoa recebeu, pro perfil dela
class ListarAvaliacoesUsuarioService:
    def execute(self, idUsuario):
        usuario = UsuarioRepository.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        resultado = []
        for avaliacao in ReputacaoService.listarRecebidasLiberadas(usuario.id):
            dados = a.to_dict(avaliacao)
            dados["avaliador"] = u.to_dict(avaliacao.avaliador)
            dados["projeto"] = {
                "id": avaliacao.projeto.id,
                "nome": avaliacao.projeto.nome
            }
            resultado.append(dados)

        return {
            "reputacao": ReputacaoService.reputacao(usuario.id),
            "avaliacoes": resultado
        }, 200
