from flask import Blueprint, request, jsonify
from services.listarUsuariosService import ListarUsuariosService
from services.buscarUsuarioService import BuscarUsuarioService
from services.listarProjetosUsuarioService import ListarProjetosUsuarioService
from services.atualizarUsuarioService import AtualizarUsuarioService
from services.deletarUsuarioService import DeletarUsuarioService
from services.listarSkillsUsuarioService import ListarSkillsUsuarioService
from services.adicionarSkillUsuarioService import AdicionarSkillUsuarioService
from services.removerSkillUsuarioService import RemoverSkillUsuarioService


class UsuarioController:
    def listar(self):
        service = ListarUsuariosService()
        return jsonify(service.execute())

    def buscar(self, id):
        service = BuscarUsuarioService()
        return jsonify(service.execute(id))

    def listarProjetos(self, id):
        service = ListarProjetosUsuarioService()
        return jsonify(service.execute(id))

    def atualizar(self, id):
        service = AtualizarUsuarioService()
        return service.execute(id, request.json)

    def deletar(self, id):
        service = DeletarUsuarioService()
        return service.execute(id)

    def listarSkills(self, id):
        service = ListarSkillsUsuarioService()
        return jsonify(service.execute(id))

    def adicionarSkill(self, id):
        service = AdicionarSkillUsuarioService()
        return service.execute(id, request.json)

    def removerSkill(self, idUsuario, idSkill):
        service = RemoverSkillUsuarioService()
        return service.execute(idUsuario, idSkill)


usuarioBp = Blueprint("usuarios", __name__)
_controller = UsuarioController()

usuarioBp.add_url_rule("/usuarios", view_func=_controller.listar, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/projeto/<id>", view_func=_controller.listarProjetos, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/<id>", view_func=_controller.buscar, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/atualizar/<id>", view_func=_controller.atualizar, methods=["PUT"])
usuarioBp.add_url_rule("/usuarios/deletar/<id>", view_func=_controller.deletar, methods=["DELETE"])
usuarioBp.add_url_rule("/usuarios/<id>/skills/", view_func=_controller.listarSkills, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/<id>/skills/", view_func=_controller.adicionarSkill, methods=["POST"], endpoint="adicionarSkill")
usuarioBp.add_url_rule("/usuarios/<idUsuario>/skills/<idSkill>", view_func=_controller.removerSkill, methods=["DELETE"])
