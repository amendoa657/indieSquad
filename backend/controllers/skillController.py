from flask import Blueprint, request
from flask import jsonify
import services.skillService as skillService

skillBp = Blueprint("skills", __name__)

@skillBp.route("/skills", methods=["GET"])
def getSkills():
    return jsonify(skillService.getSkills())

@skillBp.route("/skills/<id>", methods=["GET"])
def getSkill(id):
    return jsonify(skillService.getSkill(id))



@skillBp.route("/skills", methods=["POST"])
def registrarSkill():
    return skillService.registrarSkill(request.json)

@skillBp.route("/skills/<id>", methods=["PATCH"])
def alterarSkill(id):
    return skillService.alterarSkill(id,request.json)

@skillBp.route("/skills/<id>", methods=["DELETE"])
def deletarSkill(id):
    return skillService.deletarSkill(id)



@skillBp.route("/skills/<id>/usuarios", methods=["GET"])
def getSkillUsuarios(idSkill):
    return skillService.getSkillUsuarios(idSkill)

@skillBp.route("/skills/<idSkill>/usuarios/<idUsuario>", methods=["GET"])
def getSkillUsuario(idSkill, idUsuario):
    return skillService.getSkillUsuario(idSkill, idUsuario)

