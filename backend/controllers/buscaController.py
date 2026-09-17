from flask import Blueprint, request
from services.buscaService.buscarProfissionaisService import BuscarProfissionaisService
from services.projetoService.buscarProjetosPublicoService import BuscarProjetosPublicoService


class BuscaController:
    def profissionais(self):
        skillNome = request.args.get("skill")
        service = BuscarProfissionaisService()
        return service.execute(skillNome)

    def projetos(self):
        termo = request.args.get("q")
        service = BuscarProjetosPublicoService()
        return service.execute(termo)


buscaBp = Blueprint("busca", __name__)
_controller = BuscaController()

buscaBp.add_url_rule("/busca/profissionais", view_func=_controller.profissionais, methods=["GET"])
buscaBp.add_url_rule("/busca/projetos", view_func=_controller.projetos, methods=["GET"])
