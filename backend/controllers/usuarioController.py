from flask import Blueprint, request
from flask import jsonify
import services.usuarioService as usuarioService

usuarioBp = Blueprint("usuarios", __name__)

@usuarioBp.route("/usuarios", methods=["GET"])
def getUsuarios():
    return jsonify(usuarioService.mostrarUsuarios())

@usuarioBp.route("/usuarios/<id>", methods=["GET"])
def getUsuario(id):
    return jsonify(usuarioService.mostrarUsuario(id))


@usuarioBp.route("/usuarios/atualizar/<id>", methods=["PUT"])
def atualizarUsuario(id):
    return usuarioService.alterarUsuario(id, request.json)

@usuarioBp.route("/usuarios/deletar/<id>", methods=["DELETE"])
def deletarUsuario(id):
    return usuarioService.deletarUsuario(id)







