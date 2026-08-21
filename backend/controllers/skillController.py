from flask import Blueprint, request, jsonify
from services.listarSkillsService import ListarSkillsService
from services.buscarSkillService import BuscarSkillService
from services.registrarSkillService import RegistrarSkillService
from services.atualizarSkillService import AtualizarSkillService
from services.deletarSkillService import DeletarSkillService


class SkillController:
    def listar(self):
        service = ListarSkillsService()
        return jsonify(service.execute())

    def buscar(self, id):
        service = BuscarSkillService()
        return jsonify(service.execute(id))

    def registrar(self):
        service = RegistrarSkillService()
        return service.execute(request.json)

    def atualizar(self, id):
        service = AtualizarSkillService()
        return service.execute(id, request.json)

    def deletar(self, id):
        service = DeletarSkillService()
        return service.execute(id)


skillBp = Blueprint("skills", __name__)
_controller = SkillController()

skillBp.add_url_rule("/skills", view_func=_controller.listar, methods=["GET"])
skillBp.add_url_rule("/skills/<id>", view_func=_controller.buscar, methods=["GET"])
skillBp.add_url_rule("/skills", view_func=_controller.registrar, methods=["POST"], endpoint="registrarSkill")
skillBp.add_url_rule("/skills/<id>", view_func=_controller.atualizar, methods=["PATCH"], endpoint="atualizarSkill")
skillBp.add_url_rule("/skills/<id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarSkill")
