import models.vagaProjeto as v
import models.candidaturaUsuario as c
from services.matchService import similaridadeTexto
from services.matchService.calcularCompatibilidadeService import CalcularCompatibilidadeService
from middlewares.autenticacao import idUsuarioLogado
from repositories.candidaturaRepository import CandidaturaRepository
from repositories.projetoRepository import ProjetoRepository
from repositories.usuarioRepository import UsuarioRepository
from repositories.vagaProjetoRepository import VagaProjetoRepository


# as vagas de um projeto so
class ListarVagasProjetoService:
    def execute(self, idProjeto):
        projeto = ProjetoRepository.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        idLogado = idUsuarioLogado()
        usuario = UsuarioRepository.buscarPorId(idLogado) if idLogado else None

        calculo = CalcularCompatibilidadeService()
        vagas = VagaProjetoRepository.listarPorProjeto(projeto.id)

        # o idf sai do proprio conjunto de vagas do projeto mais a bio da pessoa
        idf = None
        if usuario and usuario.skills:
            textos = [f"{projeto.nome} {projeto.descricao or ''} {vaga.titulo} {vaga.descricao or ''}" for vaga in vagas]
            textos.append(f"{usuario.bio or ''} " + " ".join(vinculo.skills.nome for vinculo in usuario.skills))
            idf = similaridadeTexto.calcularIdf(textos)

        resultado = []
        for vaga in vagas:
            dados = v.to_dict(vaga)
            dados["totalCandidaturas"] = len(vaga.candidaturasUsuarios)

            # marca se quem esta olhando ja se candidatou nessa vaga
            if idLogado is None:
                dados["minhaCandidatura"] = None
            else:
                minha = CandidaturaRepository.buscarDoUsuarioNaVaga(idLogado, vaga.id)
                dados["minhaCandidatura"] = c.to_dict(minha) if minha else None

            # quem nao e o dono ve o quanto combina com a vaga
            dados["compatibilidade"] = None
            if usuario and usuario.skills and projeto.criador_id != idLogado:
                dados["compatibilidade"] = calculo.execute(usuario, vaga, projeto, idf)

            resultado.append(dados)

        return resultado, 200
