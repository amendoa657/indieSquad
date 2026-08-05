import models.projeto as p
import models.usuario as u
from models.membroProjeto import MembroProjeto


def adicionarMembro(idProjeto, idUsuario):
    usuario = u.buscarPorId(idUsuario)
    projeto = p.buscarPorId(idProjeto)

    membro = MembroProjeto(
        projeto=projeto,
        usuario=usuario,
        cargo="MEMBRO"
    )

    return p.adicionarMembro(projeto, membro)


def getCriador(id):
    projeto = p.buscarPorId(id)

    return u.to_dict(projeto.criador)
def getProjetos():
    projetos = p.mostrarProjetos()

    lista = []

    for projeto in projetos:
        lista.append(p.to_dict(projeto))

    return lista

def registrarProjeto(dados):
    nome = dados["nome"]
    status = dados["status"]
    usuario_id = dados["usuario_id"]
    descricao=dados.get("descricao")
    logoProjeto=dados.get("logoProjeto")

    return p.registrarProjeto(nome, status, usuario_id, descricao, logoProjeto)