import models.projetos as p
import models.vagaProjeto as v
import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


# as vagas de um projeto so
class ListarVagasProjetoService:
    def execute(self, idProjeto):
        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        idLogado = idUsuarioLogado()

        resultado = []
        for vaga in v.listarPorProjeto(projeto.id):
            dados = v.to_dict(vaga)
            dados["totalCandidaturas"] = len(vaga.candidaturasUsuarios)

            # marca se quem esta olhando ja se candidatou nessa vaga
            if idLogado is None:
                dados["minhaCandidatura"] = None
            else:
                minha = c.buscarDoUsuarioNaVaga(idLogado, vaga.id)
                dados["minhaCandidatura"] = c.to_dict(minha) if minha else None

            resultado.append(dados)

        return resultado, 200
