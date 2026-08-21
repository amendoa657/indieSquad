from flask import Blueprint, request, jsonify
from services.listarVagasService import ListarVagasService
from services.buscarVagaService import BuscarVagaService
from services.registrarVagaService import RegistrarVagaService
from services.atualizarVagaService import AtualizarVagaService
from services.deletarVagaService import DeletarVagaService
from services.buscarProjetoVagaService import BuscarProjetoVagaService
from services.buscarSkillVagaService import BuscarSkillVagaService


class VagaProjetoController:
    def listar(self):
        service = ListarVagasService()
        return jsonify(service.execute())

    def buscar(self, id):
        service = BuscarVagaService()
        return jsonify(service.execute(id))

    def registrar(self):
        service = RegistrarVagaService()
        return service.execute(request.json)

    def atualizar(self, id):
        service = AtualizarVagaService()
        return service.execute(id, request.json)

    def deletar(self, id):
        service = DeletarVagaService()
        return service.execute(id)

    def buscarProjeto(self, id):
        service = BuscarProjetoVagaService()
        return jsonify(service.execute(id))

    def buscarSkill(self, id):
        service = BuscarSkillVagaService()
        return jsonify(service.execute(id))


vagaBp = Blueprint("vagaProjeto", __name__)
_controller = VagaProjetoController()

vagaBp.add_url_rule("/vagas", view_func=_controller.listar, methods=["GET"])
vagaBp.add_url_rule("/vagas/<id>", view_func=_controller.buscar, methods=["GET"])
vagaBp.add_url_rule("/vagas", view_func=_controller.registrar, methods=["POST"], endpoint="registrarVaga")
vagaBp.add_url_rule("/vagas/<id>", view_func=_controller.atualizar, methods=["PUT"], endpoint="atualizarVaga")
vagaBp.add_url_rule("/vagas/<id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarVaga")
vagaBp.add_url_rule("/vagas/<id>/projeto", view_func=_controller.buscarProjeto, methods=["GET"])
vagaBp.add_url_rule("/vagas/<id>/skill", view_func=_controller.buscarSkill, methods=["GET"])
