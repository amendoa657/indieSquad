from flask import Blueprint, request
from flask import jsonify
import services.usuarioService as usuarioService

usuarioBp = Blueprint("usuarios", __name__)

@usuarioBp.route("/usuarios", methods=["GET"])
def getUsuarios():
    return jsonify(usuarioService.mostrarUsuarios())

@usuarioBp.route("/usuarios/projeto/<id>", methods=["GET"])
def getPU(id):
    return jsonify(usuarioService.mostrarProjeto(id))

@usuarioBp.route("/usuarios/<id>", methods=["GET"])
def getUsuario(id):
    return jsonify(usuarioService.mostrarUsuario(id))


@usuarioBp.route("/usuarios/atualizar/<id>", methods=["PUT"])
def atualizarUsuario(id):
    return usuarioService.alterarUsuario(id, request.json)

@usuarioBp.route("/usuarios/deletar/<id>", methods=["DELETE"])
def deletarUsuario(id):
    return usuarioService.deletarUsuario(id)



@usuarioBp.route("/usuarios/<id>/skills/", methods=["GET"])
def getSkillsUsuario(id):
    return usuarioService.getSkillsUsuario(id)


@usuarioBp.route("/usuarios/<id>/skills/", methods=["POST"])
def adicionarSkill(id):
    return usuarioService.adicionarSkill(id, request.json)

@usuarioBp.route("/usuarios/<idUsuario>/skills/<idSkill>", methods=["DEL"])
def removerSkill(idUsuario, idSkill):
    return usuarioService.removerSkill(idUsuario, idSkill)







