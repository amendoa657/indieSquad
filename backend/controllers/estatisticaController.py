from flask import Blueprint
from services.estatisticaService.obterEstatisticasPublicasService import ObterEstatisticasPublicasService


class EstatisticaController:
    def publicas(self):
        service = ObterEstatisticasPublicasService()
        return service.execute()


estatisticaBp = Blueprint("estatisticas", __name__)
_controller = EstatisticaController()

estatisticaBp.add_url_rule("/estatisticas", view_func=_controller.publicas, methods=["GET"])
