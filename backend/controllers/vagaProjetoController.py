from flask import Blueprint, request
from services.vagaService.listarVagasService import ListarVagasService
from services.vagaService.buscarVagaService import BuscarVagaService
from services.vagaService.registrarVagaService import RegistrarVagaService
from services.vagaService.atualizarVagaService import AtualizarVagaService
from services.vagaService.deletarVagaService import DeletarVagaService
from services.vagaService.buscarProjetoVagaService import BuscarProjetoVagaService
from services.vagaService.buscarSkillVagaService import BuscarSkillVagaService
from services.matchService.listarRecomendacoesVagaService import ListarRecomendacoesVagaService
from services.matchService.calcularCompatibilidadeVagaService import CalcularCompatibilidadeVagaService
from middlewares.autenticacao import exigirLogin, idUsuarioLogado


class VagaProjetoController:
    def listar(self):
        service = ListarVagasService()
        return service.execute()

    def buscar(self, id):
        service = BuscarVagaService()
        return service.execute(id)

    @exigirLogin
    def registrar(self):
        service = RegistrarVagaService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def atualizar(self, id):
        service = AtualizarVagaService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def deletar(self, id):
        service = DeletarVagaService()
        return service.execute(id)

    def buscarProjeto(self, id):
        service = BuscarProjetoVagaService()
        return service.execute(id)

    def buscarSkill(self, id):
        service = BuscarSkillVagaService()
        return service.execute(id)

    @exigirLogin
    def recomendacoes(self, id):
        service = ListarRecomendacoesVagaService()
        return service.execute(id)

    @exigirLogin
    def compatibilidade(self, id):
        service = CalcularCompatibilidadeVagaService()
        return service.execute(id, idUsuarioLogado())


vagaBp = Blueprint("vagaProjeto", __name__)
_controller = VagaProjetoController()

vagaBp.add_url_rule("/vagas", view_func=_controller.listar, methods=["GET"])
vagaBp.add_url_rule("/vagas/<int:id>", view_func=_controller.buscar, methods=["GET"])
vagaBp.add_url_rule("/vagas", view_func=_controller.registrar, methods=["POST"], endpoint="registrarVaga")
vagaBp.add_url_rule("/vagas/<int:id>", view_func=_controller.atualizar, methods=["PUT"], endpoint="atualizarVaga")
vagaBp.add_url_rule("/vagas/<int:id>", view_func=_controller.deletar, methods=["DELETE"], endpoint="deletarVaga")
vagaBp.add_url_rule("/vagas/<int:id>/projeto", view_func=_controller.buscarProjeto, methods=["GET"])
vagaBp.add_url_rule("/vagas/<int:id>/skill", view_func=_controller.buscarSkill, methods=["GET"])
vagaBp.add_url_rule("/vagas/<int:id>/recomendacoes", view_func=_controller.recomendacoes, methods=["GET"])
vagaBp.add_url_rule("/vagas/<int:id>/compatibilidade", view_func=_controller.compatibilidade, methods=["GET"])
