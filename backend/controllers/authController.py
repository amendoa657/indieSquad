from flask import Blueprint, request
from services.usuarioService.cadastrarUsuarioService import CadastrarUsuarioService
from services.authService.loginService import LoginService
from services.authService.obterUsuarioLogadoService import ObterUsuarioLogadoService
from middlewares.autenticacao import exigirLogin


class AuthController:
    def registrar(self):
        service = CadastrarUsuarioService()
        return service.execute(request.get_json(silent=True))

    def login(self):
        service = LoginService()
        return service.execute(request.get_json(silent=True))

    @exigirLogin
    def eu(self):
        service = ObterUsuarioLogadoService()
        return service.execute()


authBp = Blueprint("auth", __name__)
_controller = AuthController()

authBp.add_url_rule("/auth/registrar", view_func=_controller.registrar, methods=["POST"])
authBp.add_url_rule("/auth/login", view_func=_controller.login, methods=["POST"])
authBp.add_url_rule("/auth/eu", view_func=_controller.eu, methods=["GET"])
