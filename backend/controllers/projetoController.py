from flask import Blueprint, request
from flask import jsonify
import services.projetoService as projetoService

projetoBp = Blueprint("projetos", __name__)

@projetoBp.route("/projetos", methods=["GET"])
def getProjetos():
    return jsonify(projetoService.getProjetos())

@projetoBp.route("/projetos/<id>/criador", methods=["GET"])
def getCriadorProjeto(id):
    return jsonify(projetoService.getCriador(id))

@projetoBp.route("/projetos/criar", methods=["POST"])
def registerProjeto():
    return projetoService.registrarProjeto(request.json)

@projetoBp.route("/projetos/<idProjeto>/membros/add/<idUsuario>", methods=["POST"])
def addMembroProjeto(idProjeto, idUsuario):
    return projetoService.adicionarMembro(idProjeto, idUsuario)