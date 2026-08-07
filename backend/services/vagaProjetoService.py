import models.vagaProjeto as v
import models.projeto as p
import models.skills as s
from models.vagaProjeto import VagaProjeto


def getVaga(id):
    vaga = v.buscarPorId(id)

    if (vaga == None):
        return {"erro": "Vaga nao encontrada"}, 404

    return v.to_dict(vaga)




def getVagas():
    vagas = v.mostrarVagaProjetos()

    lista = []

    for vaga in vagas:
        lista.append(v.to_dict(vaga))

    return lista

def registrarProjeto(dados):
    titulo = dados["titulo"]
    descricao = dados["descricao"]
    status = dados["status"]
    idProjeto = dados["idProjeto"]
    idSkill = dados["idSkill"]

    v.registrarVagaProjeto(titulo, descricao, status, idProjeto, idSkill)

    return f"Vaga {titulo} registrada com sucesso"

def alterarVaga(id, dados):
    vaga = v.buscarPorId(id)

    if(vaga == None):
        return {"erro" : "Vaga nao encontrado"}, 404


    if "titulo" in dados:
        vaga.titulo = dados["titulo"]

    if "descricao" in dados:
        vaga.descricao = dados["descricao"]

    if "status" in dados:
        vaga.status = dados["status"]

    if "idProjeto" in dados:
        vaga.projeto_id = dados["idProjeto"]

    if "idSkill" in dados:
        vaga.skill_id = dados["idSkill"]

    v.salvar()

    return "Vaga alterada com sucesso",200

def deletarVaga(id):
    vaga = v.buscarPorId(id)

    if(vaga == None):
        return {"erro" : "Vaga nao encontrada"}, 404

    v.removerVagaProjeto(vaga)

    return "Vaga deletada com sucesso",200


def getProjetoVaga(id):
    vaga = v.buscarPorId(id)

    if(vaga == None):
        return {"erro" : "Vaga nao encontrada"}, 404

    return p.to_dict(vaga.projetoCriador)

def getSkillVaga(id):
    vaga = v.buscarPorId(id)

    if(vaga == None):
        return {"erro" : "Vaga nao encontrada"}, 404

    return s.to_dict(vaga.skill)
