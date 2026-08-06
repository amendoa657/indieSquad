import models.projeto as p
import models.usuario as u
from models.membroProjeto import MembroProjeto

def getProjetos():
    projetos = p.mostrarProjetos()

    lista = []

    for projeto in projetos:
        lista.append(p.to_dict(projeto))

    return lista

def getProjeto(id):
    projeto = p.buscarPorId(id)

    if (projeto == None):
        return {"erro": "Projeto nao encontrado"}, 404

    return p.to_dict(projeto)



def registrarProjeto(dados):
    nome = dados["nome"]
    status = dados["status"]
    usuario_id = dados["usuario_id"]
    descricao=dados.get("descricao")
    logoProjeto=dados.get("logoProjeto")

    return p.registrarProjeto(nome, status, usuario_id, descricao, logoProjeto)

def alterarProjeto(id, dados):
    Projeto = p.buscarPorId(id)

    if(Projeto == None):
        return {"erro" : "Projeto nao encontrado"}, 404


    if "nome" in dados:
        Projeto.nome = dados["nome"]

    if "descricao" in dados:
        Projeto.descricao = dados["descricao"]

    if "status" in dados:
        Projeto.status = dados["status"]

    if "logoProjeto" in dados:
        Projeto.logoProjeto = dados["logoProjeto"]

    p.salvar()

    return "Projeto alterado com sucesso",200

def removerProjeto(id):
    projeto = p.buscarPorId(id)

    if(projeto == None):
        return {"erro" : "Projeto nao encontrado"}, 404

    return p.removerProjeto(projeto)



def getMembros(idProjeto):
    projeto = p.buscarPorId(idProjeto)

    if(projeto == None):
        return {"erro" : "Projeto nao encontrado"}, 404

    lista = []

    for membro in p.getMembrosProjeto(projeto):
        lista.append(u.to_dict(membro.usuario))

    return lista


def adicionarMembro(idProjeto, idUsuario):
    usuario = u.buscarPorId(idUsuario)
    projeto = p.buscarPorId(idProjeto)

    for membro in projeto.membros:
        if(membro.usuario.id == usuario.id):
            return {"erro" : "Esse Usuario ja é membro do projeto"}, 409

    if(projeto == None and usuario == None):
        return {"erro" : "Projeto e usuarios nao encontrados"}, 404

    if(projeto == None):
        return {"erro" : "Projeto nao encontrado"}, 404

    if(usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404

    membro = MembroProjeto(
        projeto=projeto,
        usuario=usuario,
        cargo="MEMBRO"
    )

    return p.adicionarMembro(projeto, membro)

def removerMembro(idProjeto, idUsuario):
    usuario = u.buscarPorId(idUsuario)
    projeto = p.buscarPorId(idProjeto)

    if (projeto == None and usuario == None):
        return {"erro": "Projeto e usuarios nao encontrados"}, 404

    if (projeto == None):
        return {"erro": "Projeto nao encontrado"}, 404

    if (usuario == None):
        return {"erro": "Usuario nao encontrado"}, 404

    membro = MembroProjeto.query.filter_by(
        projeto_id=projeto.id,
        usuario_id=usuario.id
    ).first()

    return p.removerMembro(projeto, membro)


def getCriador(id):
    projeto = p.buscarPorId(id)

    if (projeto == None):
        return {"erro": "Projeto nao encontrado"}, 404

    return u.to_dict(projeto.criador)