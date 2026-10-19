from flask import Blueprint, request
from services.usuarioService.listarUsuariosService import ListarUsuariosService
from services.usuarioService.buscarUsuarioService import BuscarUsuarioService
from services.usuarioService.buscarUsuarioPorHandleService import BuscarUsuarioPorHandleService
from services.usuarioService.listarProjetosUsuarioService import ListarProjetosUsuarioService
from services.usuarioService.atualizarUsuarioService import AtualizarUsuarioService
from services.usuarioService.alterarSenhaService import AlterarSenhaService
from services.usuarioService.deletarUsuarioService import DeletarUsuarioService
from services.usuarioService.listarSkillsUsuarioService import ListarSkillsUsuarioService
from services.usuarioService.adicionarSkillUsuarioService import AdicionarSkillUsuarioService
from services.usuarioService.removerSkillUsuarioService import RemoverSkillUsuarioService
from services.usuarioService.obterEstatisticasUsuarioService import ObterEstatisticasUsuarioService
from middlewares.autenticacao import exigirLogin


class UsuarioController:
    @exigirLogin
    def listar(self):
        service = ListarUsuariosService()
        return service.execute()

    def buscar(self, id):
        service = BuscarUsuarioService()
        return service.execute(id)

    def buscarPorHandle(self, handle):
        service = BuscarUsuarioPorHandleService()
        return service.execute(handle)

    def listarProjetos(self, id):
        service = ListarProjetosUsuarioService()
        return service.execute(id)

    def estatisticas(self, id):
        service = ObterEstatisticasUsuarioService()
        return service.execute(id)

    @exigirLogin
    def atualizar(self, id):
        service = AtualizarUsuarioService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def alterarSenha(self):
        service = AlterarSenhaService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def deletar(self, id):
        service = DeletarUsuarioService()
        return service.execute(id)

    def listarSkills(self, id):
        service = ListarSkillsUsuarioService()
        return service.execute(id)

    @exigirLogin
    def adicionarSkill(self, id):
        service = AdicionarSkillUsuarioService()
        return service.execute(id, request.get_json(silent=True))

    @exigirLogin
    def removerSkill(self, idUsuario, idSkill):
        service = RemoverSkillUsuarioService()
        return service.execute(idUsuario, idSkill)


usuarioBp = Blueprint("usuarios", __name__)
_controller = UsuarioController()

usuarioBp.add_url_rule("/usuarios", view_func=_controller.listar, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/projeto/<int:id>", view_func=_controller.listarProjetos, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/handle/<handle>", view_func=_controller.buscarPorHandle, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/senha", view_func=_controller.alterarSenha, methods=["PUT"])
usuarioBp.add_url_rule("/usuarios/<int:id>", view_func=_controller.buscar, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/<int:id>/estatisticas", view_func=_controller.estatisticas, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/atualizar/<int:id>", view_func=_controller.atualizar, methods=["PUT"])
usuarioBp.add_url_rule("/usuarios/deletar/<int:id>", view_func=_controller.deletar, methods=["DELETE"])
usuarioBp.add_url_rule("/usuarios/<int:id>/skills/", view_func=_controller.listarSkills, methods=["GET"])
usuarioBp.add_url_rule("/usuarios/<int:id>/skills/", view_func=_controller.adicionarSkill, methods=["POST"], endpoint="adicionarSkill")
usuarioBp.add_url_rule("/usuarios/<int:idUsuario>/skills/<int:idSkill>", view_func=_controller.removerSkill, methods=["DELETE"])
