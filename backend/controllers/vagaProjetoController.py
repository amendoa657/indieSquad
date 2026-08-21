from flask import Blueprint, request
from flask import jsonify
import services.vagaProjetoService as vagaProjetoService

vagaBp = Blueprint("vagaProjeto", __name__)

@vagaBp.route("/vagas", methods=["GET"])
def getVagas():
    return jsonify(vagaProjetoService.getVagas())

@vagaBp.route("/vagas/<id>", methods=["GET"])
def getVaga(id):
    return jsonify(vagaProjetoService.getVaga(id))



@vagaBp.route("/vagas", methods=["POST"])
def registrarVaga():
    return vagaProjetoService.registrarProjeto(request.json)

@vagaBp.route("/vagas/<id>", methods=["PUT"])
def alterarVaga(id):
    return vagaProjetoService.alterarVaga(id, request.json)

@vagaBp.route("/vagas/<id>", methods=["DELETE"])
def deletarVaga(id):
    return vagaProjetoService.deletarVaga(id)



@vagaBp.route("/vagas/<id>/projeto", methods=["GET"])
def getProjetoVaga(id):
    return vagaProjetoService.getProjetoVaga(id)

@vagaBp.route("/vagas/<id>/skill", methods=["GET"])
def getSkillVaga(id):
    return vagaProjetoService.getSkillVaga(id)

