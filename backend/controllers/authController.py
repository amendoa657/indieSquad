from flask import Blueprint, request
from services.cadastrarUsuarioService import CadastrarUsuarioService
from services.loginService import LoginService


class AuthController:
    def registrar(self):
        dados = request.get_json()
        service = CadastrarUsuarioService()
        return service.execute(dados)

    def login(self):
        dados = request.get_json()
        service = LoginService()
        return service.execute(dados)


authBp = Blueprint("auth", __name__)
_controller = AuthController()

authBp.add_url_rule("/auth/registrar", view_func=_controller.registrar, methods=["POST"])
authBp.add_url_rule("/auth/login", view_func=_controller.login, methods=["POST"])
