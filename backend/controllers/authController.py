from flask import Blueprint, request
from services import authService

authBp = Blueprint("auth", __name__)

@authBp.route("/auth/registrar", methods=["POST"])
def registrar():
    dados = request.get_json()
    return authService.registrar(dados)


#
#@authBp.route("/auth/login", methods=["POST"])
#def login():
    #return {"usuario x"}



