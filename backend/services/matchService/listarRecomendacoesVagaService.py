import models.vagaProjeto as v
import models.usuario as u
import models.skillUsuario as su
from services.matchService import similaridadeTexto
from services.matchService.calcularCompatibilidadeService import CalcularCompatibilidadeService
from services.iaService.explicarMatchService import ExplicarMatchService
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.candidaturaRepository import CandidaturaRepository
from repositories.usuarioRepository import UsuarioRepository
from repositories.vagaProjetoRepository import VagaProjetoRepository
from services.avaliacaoService.reputacaoService import ReputacaoService

# quantos candidatos a tela mostra
LIMITE = 8

# abaixo disso nao vale a pena sugerir
NOTA_MINIMA = 25


class ListarRecomendacoesVagaService:
    def execute(self, idVaga):
        vaga = VagaProjetoRepository.buscarPorId(idVaga)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        projeto = v.getProjeto(vaga)

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        pessoas = [
            pessoa for pessoa in UsuarioRepository.mostrarUsuarios()
            if pessoa.id != projeto.criador_id and pessoa.skills
        ]

        # o idf precisa do conjunto todo pra saber quais palavras diferenciam as pessoas
        textos = [f"{pessoa.bio or ''} " + " ".join(vinculo.skills.nome for vinculo in pessoa.skills) for pessoa in pessoas]
        textos.append(f"{projeto.nome} {projeto.descricao or ''} {vaga.titulo} {vaga.descricao or ''}")
        idf = similaridadeTexto.calcularIdf(textos)

        calculo = CalcularCompatibilidadeService()

        candidatos = []
        for pessoa in pessoas:
            compatibilidade = calculo.execute(pessoa, vaga, projeto, idf)

            if compatibilidade["nota"] < NOTA_MINIMA:
                continue

            candidatura = CandidaturaRepository.buscarDoUsuarioNaVaga(pessoa.id, vaga.id)

            candidatos.append({
                "usuario": dict(
                    u.to_dict(pessoa),
                    skills=[su.to_dict(vinculo) for vinculo in pessoa.skills],
                    reputacao=ReputacaoService.reputacao(pessoa.id),
                ),
                "compatibilidade": compatibilidade,
                "jaSeCandidatou": candidatura is not None,
                "jaEhMembro": any(membro.usuario_id == pessoa.id for membro in projeto.membros),
            })

        candidatos.sort(key=lambda item: item["compatibilidade"]["nota"], reverse=True)
        candidatos = candidatos[:LIMITE]

        explicacao = ExplicarMatchService()
        candidatos = explicacao.execute(vaga, projeto, candidatos)

        return {
            "vaga": v.to_dict(vaga),
            "pesos": compatibilidade["pesos"] if candidatos else {},
            "candidatos": candidatos,
        }, 200
