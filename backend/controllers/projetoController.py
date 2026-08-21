from flask import Blueprint, request, jsonify
from services.listarProjetosService import ListarProjetosService
from services.buscarProjetoService import BuscarProjetoService
from services.registrarProjetoService import RegistrarProjetoService
from services.atualizarProjetoService import AtualizarProjetoService
from services.removerProjetoService import RemoverProjetoService
from services.listarMembrosProjetoService import ListarMembrosProjetoService
from services.adicionarMembroProjetoService import AdicionarMembroProjetoService
from services.removerMembroProjetoService import RemoverMembroProjetoService
from services.buscarCriadorProjetoService import BuscarCriadorProjetoService


class ProjetoController:
    def listar(self):
        service = ListarProjetosService()
        return jsonify(service.execute())

    def buscar(self, id):
        service = BuscarProjetoService()
        return jsonify(service.execute(id))

    def registrar(self):
        service = RegistrarProjetoService()
        return service.execute(request.json)

    def atualizar(self, id):
        service = AtualizarProjetoService()
        return service.execute(id, request.json)

    def remover(self, id):
        service = RemoverProjetoService()
        return service.execute(id)

    def listarMembros(self, id):
        service = ListarMembrosProjetoService()
        return jsonify(service.execute(id))

    def adicionarMembro(self, idProjeto, idUsuario):
        service = AdicionarMembroProjetoService()
        return service.execute(idProjeto, idUsuario)

    def removerMembro(self, idProjeto, idUsuario):
        service = RemoverMembroProjetoService()
        return service.execute(idProjeto, idUsuario)

    def buscarCriador(self, id):
        service = BuscarCriadorProjetoService()
        return jsonify(service.execute(id))


projetoBp = Blueprint("projetos", __name__)
_controller = ProjetoController()

projetoBp.add_url_rule("/projetos", view_func=_controller.listar, methods=["GET"])
projetoBp.add_url_rule("/projetos/<id>", view_func=_controller.buscar, methods=["GET"])
projetoBp.add_url_rule("/projetos", view_func=_controller.registrar, methods=["POST"], endpoint="registrarProjeto")
projetoBp.add_url_rule("/projetos/<id>", view_func=_controller.atualizar, methods=["PATCH"], endpoint="atualizarProjeto")
projetoBp.add_url_rule("/projetos/<id>", view_func=_controller.remover, methods=["DELETE"], endpoint="removerProjeto")
projetoBp.add_url_rule("/projetos/<id>/membros", view_func=_controller.listarMembros, methods=["GET"])
projetoBp.add_url_rule("/projetos/<idProjeto>/membros/<idUsuario>", view_func=_controller.adicionarMembro, methods=["POST"], endpoint="adicionarMembro")
projetoBp.add_url_rule("/projetos/<idProjeto>/membros/<idUsuario>", view_func=_controller.removerMembro, methods=["DELETE"], endpoint="removerMembro")
projetoBp.add_url_rule("/projetos/<id>/criador", view_func=_controller.buscarCriador, methods=["GET"])
