from flask import Blueprint
from services.dashboardService.obterDashboardService import ObterDashboardService
from middlewares.autenticacao import exigirLogin, idUsuarioLogado


class DashboardController:
    # O dashboard e sempre o de quem esta logado, por isso nao tem id na URL.
    # Antes qualquer um podia abrir /dashboard/9 e ver os numeros de outra
    # pessoa.
    @exigirLogin
    def obter(self):
        service = ObterDashboardService()
        return service.execute(idUsuarioLogado())


dashboardBp = Blueprint("dashboard", __name__)
_controller = DashboardController()

dashboardBp.add_url_rule("/dashboard", view_func=_controller.obter, methods=["GET"])
