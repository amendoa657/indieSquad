from flask import Blueprint, jsonify
from services.obterDashboardService import ObterDashboardService


class DashboardController:
    def obter(self, idUsuario):
        service = ObterDashboardService()
        return service.execute(idUsuario)


dashboardBp = Blueprint("dashboard", __name__)
_controller = DashboardController()

dashboardBp.add_url_rule("/dashboard/<idUsuario>", view_func=_controller.obter, methods=["GET"])
