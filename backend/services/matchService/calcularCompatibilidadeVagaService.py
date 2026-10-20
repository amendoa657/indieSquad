import models.vagaProjeto as v
import models.usuario as u
from services.matchService import similaridadeTexto
from services.matchService.calcularCompatibilidadeService import CalcularCompatibilidadeService


# a compatibilidade de quem esta logado com uma vaga, pra aparecer no card
class CalcularCompatibilidadeVagaService:
    def execute(self, idVaga, idUsuario):
        vaga = v.buscarPorId(idVaga)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        usuario = u.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        projeto = v.getProjeto(vaga)

        textoDaVaga = f"{projeto.nome} {projeto.descricao or ''} {vaga.titulo} {vaga.descricao or ''}"
        textoDaPessoa = f"{usuario.bio or ''} " + " ".join(vinculo.skills.nome for vinculo in usuario.skills)
        idf = similaridadeTexto.calcularIdf([textoDaVaga, textoDaPessoa])

        calculo = CalcularCompatibilidadeService()

        return calculo.execute(usuario, vaga, projeto, idf), 200
