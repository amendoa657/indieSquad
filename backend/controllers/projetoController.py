from flask import Blueprint, request
from flask import jsonify
import services.projetoService as projetoService

projetoBp = Blueprint("projetos", __name__)

@projetoBp.route("/projetos", methods=["GET"])
def getProjetos():
    return jsonify(projetoService.getProjetos())

@projetoBp.route("/projetos/<id>", methods=["GET"])
def getProjeto(id):
    return jsonify(projetoService.getProjeto(id))

@projetoBp.route("/projetos", methods=["POST"])
def registerProjeto():
    return projetoService.registrarProjeto(request.json)

@projetoBp.route("/projetos/<id>", methods=["PATCH"])
def alterarProjeto(id):
    return projetoService.alterarProjeto(id, request.json)

@projetoBp.route("/projetos/<id>", methods=["DELETE"])
def removerProjeto(id):
    return projetoService.removerProjeto(id)



@projetoBp.route("/projetos/<id>/membros", methods=["GET"])
def getMembrosProjeto(id):
    return jsonify(projetoService.getMembros(id))

@projetoBp.route("/projetos/<idProjeto>/membros/<idUsuario>", methods=["POST"])
def adicionarMembroProjeto(idProjeto, idUsuario):
    return projetoService.adicionarMembro(idProjeto, idUsuario)

@projetoBp.route("/projetos/<idProjeto>/membros/<idUsuario>", methods=["DELETE"])
def removerMembroProjeto(idProjeto, idUsuario):
    return projetoService.removerMembro(idProjeto, idUsuario)

@projetoBp.route("/projetos/<id>/criador", methods=["GET"])
def getCriadorProjeto(id):
    return jsonify(projetoService.getCriador(id))