from flask import Blueprint, request
from services.buscaService.buscarProfissionaisService import BuscarProfissionaisService
from services.projetoService.buscarProjetosPublicoService import BuscarProjetosPublicoService


class BuscaController:
    def profissionais(self):
        service = BuscarProfissionaisService()
        return service.execute(
            request.args.get("skill"),
            request.args.get("q"),
            request.args.get("objetivo"),
            request.args.get("tipoColaboracao"),
            request.args.get("horasMinimas"),
            request.args.get("categoria")
        )

    def projetos(self):
        service = BuscarProjetosPublicoService()
        return service.execute(
            request.args.get("q"),
            request.args.get("genero"),
            request.args.get("engine"),
            request.args.get("tipoParceria"),
            request.args.get("status")
        )


buscaBp = Blueprint("busca", __name__)
_controller = BuscaController()

buscaBp.add_url_rule("/busca/profissionais", view_func=_controller.profissionais, methods=["GET"])
buscaBp.add_url_rule("/busca/projetos", view_func=_controller.projetos, methods=["GET"])
