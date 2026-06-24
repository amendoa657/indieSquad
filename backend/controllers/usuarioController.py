from flask import Blueprint, request

usuarioBp = Blueprint("usuarios", __name__)

@usuarioBp.route("/usuarios", methods=["GET"])
def getUsuarios():
    return {"mensagem": "Listando usuários"}

@usuarioBp.route("/usuarios/<id>", methods=["GET"])
def getUsuario(id):
    return {"usuario x"}



