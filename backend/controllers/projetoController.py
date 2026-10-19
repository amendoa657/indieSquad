from flask import Blueprint, request
from services.projetoService.listarProjetosService import ListarProjetosService
from services.projetoService.buscarProjetoService import BuscarProjetoService
from services.projetoService.registrarProjetoService import RegistrarProjetoService
from services.projetoService.atualizarProjetoService import AtualizarProjetoService
from services.projetoService.concluirProjetoService import ConcluirProjetoService
from services.projetoService.removerProjetoService import RemoverProjetoService
from services.projetoService.listarMembrosProjetoService import ListarMembrosProjetoService
from services.projetoService.adicionarMembroProjetoService import AdicionarMembroProjetoService
from services.projetoService.removerMembroProjetoService import RemoverMembroProjetoService
from services.projetoService.buscarCriadorProjetoService import BuscarCriadorProjetoService
from services.projetoService.listarVagasProjetoService import ListarVagasProjetoService
from services.projetoService.listarCandidaturasProjetoService import ListarCandidaturasProjetoService
from services.projetoService.adicionarMarcoProjetoService import AdicionarMarcoProjetoService
from services.projetoService.atualizarMarcoProjetoService import AtualizarMarcoProjetoService
from services.projetoService.removerMarcoProjetoService import RemoverMarcoProjetoService
from middlewares.autenticacao import exigirLogin


class ProjetoController:
    def listar(self):
        service = ListarProjetosService()
        return service.execute()

    def buscar(self, id):
        service = BuscarProjetoService()
        return service.execute(id)

    @exigirLogin
    def registrar(self):
        service = RegistrarProjetoService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def atualizar(self, id):
        service = AtualizarProjetoService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def concluir(self, id):
        service = ConcluirProjetoService()
        return service.execute(id)

    @exigirLogin
    def remover(self, id):
        service = RemoverProjetoService()
        return service.execute(id)

    def listarMembros(self, id):
        service = ListarMembrosProjetoService()
        return service.execute(id)

    @exigirLogin
    def adicionarMembro(self, idProjeto, idUsuario):
        service = AdicionarMembroProjetoService()
        return service.execute(idProjeto, idUsuario)

    @exigirLogin
    def removerMembro(self, idProjeto, idUsuario):
        service = RemoverMembroProjetoService()
        return service.execute(idProjeto, idUsuario)

    def buscarCriador(self, id):
        service = BuscarCriadorProjetoService()
        return service.execute(id)

    def listarVagas(self, id):
        service = ListarVagasProjetoService()
        return service.execute(id)

    @exigirLogin
    def listarCandidaturas(self, id):
        service = ListarCandidaturasProjetoService()
        return service.execute(id)

    @exigirLogin
    def adicionarMarco(self, id):
        service = AdicionarMarcoProjetoService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def atualizarMarco(self, idMarco):
        service = AtualizarMarcoProjetoService()
        return service.execute(idMarco, request.get_json(silent=True))

    @exigirLogin
    def removerMarco(self, idMarco):
        service = RemoverMarcoProjetoService()
        return service.execute(idMarco)


projetoBp = Blueprint("projetos", __name__)
_controller = ProjetoController()

projetoBp.add_url_rule("/projetos", view_func=_controller.listar, methods=["GET"])
projetoBp.add_url_rule("/projetos/<int:id>", view_func=_controller.buscar, methods=["GET"])
projetoBp.add_url_rule("/projetos", view_func=_controller.registrar, methods=["POST"], endpoint="registrarProjeto")
projetoBp.add_url_rule("/projetos/<int:id>", view_func=_controller.atualizar, methods=["PATCH"], endpoint="atualizarProjeto")
projetoBp.add_url_rule("/projetos/<int:id>", view_func=_controller.remover, methods=["DELETE"], endpoint="removerProjeto")
projetoBp.add_url_rule("/projetos/<int:id>/concluir", view_func=_controller.concluir, methods=["PATCH"])
projetoBp.add_url_rule("/projetos/<int:id>/membros", view_func=_controller.listarMembros, methods=["GET"])
projetoBp.add_url_rule("/projetos/<int:idProjeto>/membros/<int:idUsuario>", view_func=_controller.adicionarMembro, methods=["POST"], endpoint="adicionarMembro")
projetoBp.add_url_rule("/projetos/<int:idProjeto>/membros/<int:idUsuario>", view_func=_controller.removerMembro, methods=["DELETE"], endpoint="removerMembro")
projetoBp.add_url_rule("/projetos/<int:id>/criador", view_func=_controller.buscarCriador, methods=["GET"])
projetoBp.add_url_rule("/projetos/<int:id>/vagas", view_func=_controller.listarVagas, methods=["GET"])
projetoBp.add_url_rule("/projetos/<int:id>/candidaturas", view_func=_controller.listarCandidaturas, methods=["GET"])
projetoBp.add_url_rule("/projetos/<int:id>/marcos", view_func=_controller.adicionarMarco, methods=["POST"])
projetoBp.add_url_rule("/marcos/<int:idMarco>", view_func=_controller.atualizarMarco, methods=["PATCH"])
projetoBp.add_url_rule("/marcos/<int:idMarco>", view_func=_controller.removerMarco, methods=["DELETE"], endpoint="removerMarco")
