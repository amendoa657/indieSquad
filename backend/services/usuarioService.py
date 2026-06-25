import repositories.usuarioRepository as r


def mostrarUsuarios():
    usuarios = r.mostrarUsuarios()

    lista = []

    for u in usuarios:
        usuarioD = {
            "id": u.id,
            "usuario": u.usuario,
            "email": u.email
        }
        lista.append(usuarioD)

    return lista

def mostrarUsuario(id):
    usuario = r.mostrarUsuario(id)

    usuarioD = {
        "id": usuario.id,
        "usuario": usuario.usuario,
        "email": usuario.email
    }

    return usuarioD