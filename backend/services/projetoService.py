import models.projeto as p


def mostrarProjetos():
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