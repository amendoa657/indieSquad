from flask import Blueprint, request
from services.avaliacaoService.registrarAvaliacaoService import RegistrarAvaliacaoService
from services.avaliacaoService.listarAvaliacoesProjetoService import ListarAvaliacoesProjetoService
from services.avaliacaoService.listarAvaliacoesUsuarioService import ListarAvaliacoesUsuarioService
from middlewares.autenticacao import exigirLogin


class AvaliacaoController:
    @exigirLogin
    def registrar(self):
        service = RegistrarAvaliacaoService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def listarPorProjeto(self, idProjeto):
        service = ListarAvaliacoesProjetoService()
        return service.execute(idProjeto)

    def listarPorUsuario(self, idUsuario):
        service = ListarAvaliacoesUsuarioService()
        return service.execute(idUsuario)


avaliacaoBp = Blueprint("avaliacoes", __name__)
_controller = AvaliacaoController()

avaliacaoBp.add_url_rule("/avaliacoes", view_func=_controller.registrar, methods=["POST"])
avaliacaoBp.add_url_rule("/projetos/<int:idProjeto>/avaliacoes", view_func=_controller.listarPorProjeto, methods=["GET"])
avaliacaoBp.add_url_rule("/usuarios/<int:idUsuario>/avaliacoes", view_func=_controller.listarPorUsuario, methods=["GET"])
