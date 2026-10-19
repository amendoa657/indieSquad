from flask import Blueprint, request
from services.candidaturaService.listarCandidaturasService import ListarCandidaturasService
from services.candidaturaService.buscarCandidaturaService import BuscarCandidaturaService
from services.candidaturaService.registrarCandidaturaService import RegistrarCandidaturaService
from services.candidaturaService.atualizarCandidaturaService import AtualizarCandidaturaService
from services.candidaturaService.responderCandidaturaService import ResponderCandidaturaService
from services.candidaturaService.deletarCandidaturaService import DeletarCandidaturaService
from services.candidaturaService.buscarProjetoCandidaturaService import BuscarProjetoCandidaturaService
from services.candidaturaService.buscarUsuarioCandidaturaService import BuscarUsuarioCandidaturaService
from services.usuarioService.listarCandidaturasUsuarioService import ListarCandidaturasUsuarioService
from middlewares.autenticacao import exigirLogin


class CandidaturaController:
    @exigirLogin
    def listar(self):
        service = ListarCandidaturasService()
        return service.execute()

    @exigirLogin
    def buscar(self, id):
        service = BuscarCandidaturaService()
        return service.execute(id)

    @exigirLogin
    def registrar(self):
        service = RegistrarCandidaturaService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def atualizar(self, id):
        service = AtualizarCandidaturaService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def responder(self, id):
        service = ResponderCandidaturaService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def deletar(self, id):
        service = DeletarCandidaturaService()
        return service.execute(id)

    @exigirLogin
    def buscarProjeto(self, id):
        service = BuscarProjetoCandidaturaService()
        return service.execute(id)

    @exigirLogin
    def buscarUsuario(self, id):
        service = BuscarUsuarioCandidaturaService()
        return service.execute(id)

    @exigirLogin
    def listarPorUsuario(self, idUsuario):
        service = ListarCandidaturasUsuarioService()
        return service.execute(idUsuario)


candidaturaBp = Blueprint("candidatura", __name__)
_controller = CandidaturaController()

candidaturaBp.add_url_rule("/candidaturas", view_func=_controller.listar, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/usuario/<int:idUsuario>", view_func=_controller.listarPorUsuario, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/<int:id>", view_func=_controller.buscar, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas", view_func=_controller.registrar, methods=["POST"], endpoint="registrarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<int:id>", view_func=_controller.atualizar, methods=["PUT"], endpoint="atualizarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<int:id>/responder", view_func=_controller.responder, methods=["PUT"])
candidaturaBp.add_url_rule("/candidaturas/<int:id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<int:id>/projeto", view_func=_controller.buscarProjeto, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/<int:id>/usuario", view_func=_controller.buscarUsuario, methods=["GET"])
