from flask import Blueprint, request
from flask import jsonify
import services.projetoService as projetoService

projetoBp = Blueprint("projetos", __name__)

@projetoBp.route("/projetos", methods=["GET"])
def getProjetos():
    return jsonify(projetoService.mostrarProjetos())

@projetoBp.route("/projetos/<id>/criador", methods=["POST"])
def getCriadorProjeto(id):
    pass

@projetoBp.route("/projetos/criar", methods=["POST"])
def registerProjeto():
    return projetoService.registrarProjeto(request.json)