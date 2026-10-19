import models.projetos as p
import models.usuario as u
import models.marcoProjeto as m
from middlewares.autenticacao import idUsuarioLogado


class BuscarProjetoService:
    def execute(self, id):
        projeto = p.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        idLogado = idUsuarioLogado()

        # Monta a tela de projeto inteira num pedido so. Antes o front fazia
        # cinco pedidos e baixava todas as vagas e candidaturas do sistema pra
        # filtrar no navegador.
        dados = p.to_dict(projeto)
        dados["criador"] = u.to_dict(projeto.criador)
        dados["marcos"] = [m.to_dict(marco) for marco in projeto.marcos]
        dados["totalMembros"] = len(projeto.membros)
        dados["vagasAbertas"] = len([vaga for vaga in projeto.vagas if vaga.status == "aberta"])
        dados["ehCriador"] = idLogado is not None and projeto.criador_id == idLogado
        dados["ehDaEquipe"] = idLogado is not None and p.ehDaEquipe(projeto, idLogado)

        return dados, 200
