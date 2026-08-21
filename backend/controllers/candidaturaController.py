from flask import Blueprint, request
from flask import jsonify
import services.candidaturaService as candidaturaService

candidaturaBp = Blueprint("candidatura", __name__)

@candidaturaBp.route("/candidaturas", methods=["GET"])
def getCandidaturas():
    return jsonify(candidaturaService.getCandidaturas())

@candidaturaBp.route("/candidaturas/<id>", methods=["GET"])
def getCandidatura(id):
    return jsonify(candidaturaService.getCandidatura(id))



@candidaturaBp.route("/candidaturas", methods=["POST"])
def registrarCandidatura():
    return candidaturaService.registrarCandidatura(request.json)

@candidaturaBp.route("/candidaturas/<id>", methods=["PUT"])
def alterarCandidatura(id):
    return candidaturaService.alterarCandidatura(id, request.json)

@candidaturaBp.route("/candidaturas/<id>", methods=["DELETE"])
def deletarCandidatura(id):
    return candidaturaService.deletarVaga(id)



@candidaturaBp.route("/candidaturas/<id>/projeto", methods=["GET"])
def getProjeto(id):
    return candidaturaService.getProjeto(id)

@candidaturaBp.route("/candidaturas/<id>/usuario", methods=["GET"])
def getUsuario(id):
    return candidaturaService.getUsuario(id)

