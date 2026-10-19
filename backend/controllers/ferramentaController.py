from flask import Blueprint
from services.ferramentaService.listarFerramentasService import ListarFerramentasService


class FerramentaController:
    def listar(self):
        service = ListarFerramentasService()
        return service.execute()


ferramentaBp = Blueprint("ferramentas", __name__)
_controller = FerramentaController()

ferramentaBp.add_url_rule("/ferramentas", view_func=_controller.listar, methods=["GET"])
