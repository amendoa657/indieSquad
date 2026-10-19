import models.projetos as p
import models.vagaProjeto as v
import models.candidaturaUsuario as c
from middlewares.autenticacao import idUsuarioLogado


# As vagas de um projeto so. Substitui o GET /vagas que o front usava pra
# baixar todas as vagas do sistema e filtrar no navegador.
class ListarVagasProjetoService:
    def execute(self, idProjeto):
        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        idLogado = idUsuarioLogado()

        resultado = []
        for vaga in v.listarPorProjeto(projeto.id):
            dados = v.to_dict(vaga)
            dados["totalCandidaturas"] = len(vaga.candidaturasUsuarios)

            # Marca se quem esta olhando ja se candidatou, pra tela mostrar
            # "Candidatura enviada" em vez de oferecer o botao de novo.
            if idLogado is None:
                dados["minhaCandidatura"] = None
            else:
                minha = c.buscarDoUsuarioNaVaga(idLogado, vaga.id)
                dados["minhaCandidatura"] = c.to_dict(minha) if minha else None

            resultado.append(dados)

        return resultado, 200
