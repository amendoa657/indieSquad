import models.candidaturaUsuario as c
import models.projetos as p
import models.skills as s
import models.usuario as u


def getCandidatura(id):
    candidatura = c.buscarPorId(id)

    if (candidatura == None):
        return {"erro": "Candidatura nao encontrada"}, 404

    return c.to_dict(candidatura)




def getCandidaturas():
    candidaturas = c.mostrarCandidaturas()

    lista = []

    for candidatura in candidaturas:
        lista.append(c.to_dict(candidatura))

    return lista

def registrarCandidatura(dados):
    mensagem = dados["mensagem"]
    status = dados["status"]
    idVagaProjeto = dados["idVagaProjeto"]
    idUsuario = dados["idUsuario"]

    c.registrarCandidatura(mensagem, status, idVagaProjeto, idUsuario)

    return f"Candidatura registrada com sucesso"

def alterarCandidatura(id, dados):
    candidatura = c.buscarPorId(id)

    if(candidatura == None):
        return {"erro" : "Candidatura nao encontrada"}, 404

    if "mensagem" in dados:
        candidatura.mensagem = dados["mensagem"]

    if "status" in dados:
        candidatura.status = dados["status"]

    if "idVagaProjeto" in dados:
        candidatura.vagaProjeto_id = dados["idVagaProjeto"]

    if "idUsuario" in dados:
        candidatura.usuario_id = dados["idUsuario"]

    c.salvar()

    return "Candidatura alterada com sucesso",200

def deletarVaga(id):
    candidatura = c.buscarPorId(id)

    if(candidatura == None):
        return {"erro" : "Candidatura nao encontrada"}, 404

    c.removerCandidatura(candidatura)

    return "Candidatura deletada com sucesso",200


def getProjeto(id):
    candidatura = c.buscarPorId(id)

    if(candidatura == None):
        return {"erro" : "Candidatura nao encontrada"}, 404

    return p.to_dict(candidatura.projetoVaga)

def getUsuario(id):
    candidatura = c.buscarPorId(id)

    if(candidatura == None):
        return {"erro" : "Candidatura nao encontrada"}, 404

    return u.to_dict(candidatura.candidato)
