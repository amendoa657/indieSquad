import models.usuario as u


def mostrarUsuarios():
    usuarios = u.mostrarUsuarios()

    lista = []

    for user in usuarios:
        usuarioD = {
            "id": user.id,
            "usuario": user.usuario,
            "email": user.email
        }
        lista.append(usuarioD)

    return lista

def mostrarUsuario(id):
    usuario = u.mostrarUsuario(id)

    usuarioD = {
        "id": usuario.id,
        "usuario": usuario.usuario,
        "email": usuario.email
    }

    return usuarioD

def alterarUsuario(id, dados):
    Usuario = u.buscarPorId(id)

    if(Usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404


    if "usuario" in dados:
        Usuario.usuario = dados["usuario"]

    if "email" in dados:
        Usuario.email = dados["email"]

    if "senha" in dados:
        Usuario.senha = dados["senha"]

    if "bio" in dados:
        Usuario.bio = dados["bio"]

    if "fotoDePerfil" in dados:
        Usuario.fotoDePerfil = dados["fotoDePerfil"]

    u.salvar()

    return "Usuario alterado com sucesso",200

def deletarUsuario(id):
    Usuario = u.buscarPorId(id)

    if(Usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404

    u.deletarUsuario(Usuario)

    return "Usuario deletado com sucesso",200





