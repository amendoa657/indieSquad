from flask import Blueprint, request
from services.skillService.listarSkillsService import ListarSkillsService
from services.skillService.buscarSkillService import BuscarSkillService
from services.skillService.registrarSkillService import RegistrarSkillService
from services.skillService.atualizarSkillService import AtualizarSkillService
from services.skillService.deletarSkillService import DeletarSkillService
from middlewares.autenticacao import exigirLogin


class SkillController:
    def listar(self):
        service = ListarSkillsService()
        return service.execute()

    def buscar(self, id):
        service = BuscarSkillService()
        return service.execute(id)

    # O catalogo de funcoes e manutencao do sistema, nao e o usuario que monta.
    # Num sistema com papeis isso aqui seria so pra administrador; como o
    # IndieSquad ainda nao tem papel de admin, exigimos pelo menos login.
    @exigirLogin
    def registrar(self):
        service = RegistrarSkillService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def atualizar(self, id):
        service = AtualizarSkillService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def deletar(self, id):
        service = DeletarSkillService()
        return service.execute(id)


skillBp = Blueprint("skills", __name__)
_controller = SkillController()

skillBp.add_url_rule("/skills", view_func=_controller.listar, methods=["GET"])
skillBp.add_url_rule("/skills/<int:id>", view_func=_controller.buscar, methods=["GET"])
skillBp.add_url_rule("/skills", view_func=_controller.registrar, methods=["POST"], endpoint="registrarSkill")
skillBp.add_url_rule("/skills/<int:id>", view_func=_controller.atualizar, methods=["PATCH"], endpoint="atualizarSkill")
skillBp.add_url_rule("/skills/<int:id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarSkill")
