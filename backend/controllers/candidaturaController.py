from flask import Blueprint, request, jsonify
from services.candidaturaService.listarCandidaturasService import ListarCandidaturasService
from services.candidaturaService.buscarCandidaturaService import BuscarCandidaturaService
from services.candidaturaService.registrarCandidaturaService import RegistrarCandidaturaService
from services.candidaturaService.atualizarCandidaturaService import AtualizarCandidaturaService
from services.candidaturaService.deletarCandidaturaService import DeletarCandidaturaService
from services.candidaturaService.buscarProjetoCandidaturaService import BuscarProjetoCandidaturaService
from services.candidaturaService.buscarUsuarioCandidaturaService import BuscarUsuarioCandidaturaService
from services.usuarioService.listarCandidaturasUsuarioService import ListarCandidaturasUsuarioService


class CandidaturaController:
    def listar(self):
        service = ListarCandidaturasService()
        return jsonify(service.execute())

    def buscar(self, id):
        service = BuscarCandidaturaService()
        return jsonify(service.execute(id))

    def registrar(self):
        service = RegistrarCandidaturaService()
        return service.execute(request.json)

    def atualizar(self, id):
        service = AtualizarCandidaturaService()
        return service.execute(id, request.json)

    def deletar(self, id):
        service = DeletarCandidaturaService()
        return service.execute(id)

    def buscarProjeto(self, id):
        service = BuscarProjetoCandidaturaService()
        return service.execute(id)

    def buscarUsuario(self, id):
        service = BuscarUsuarioCandidaturaService()
        return service.execute(id)

    def listarPorUsuario(self, idUsuario):
        service = ListarCandidaturasUsuarioService()
        return service.execute(idUsuario)


candidaturaBp = Blueprint("candidatura", __name__)
_controller = CandidaturaController()

candidaturaBp.add_url_rule("/candidaturas", view_func=_controller.listar, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/<id>", view_func=_controller.buscar, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas", view_func=_controller.registrar, methods=["POST"], endpoint="registrarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<id>", view_func=_controller.atualizar, methods=["PUT"], endpoint="atualizarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarCandidatura")
candidaturaBp.add_url_rule("/candidaturas/<id>/projeto", view_func=_controller.buscarProjeto, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/<id>/usuario", view_func=_controller.buscarUsuario, methods=["GET"])
candidaturaBp.add_url_rule("/candidaturas/usuario/<idUsuario>", view_func=_controller.listarPorUsuario, methods=["GET"])
