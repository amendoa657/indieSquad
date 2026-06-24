import repositories.usuarioRepository as r


def registrar(dados):
    usuario = dados["usuario"]
    email = dados["email"]
    senha = dados["senha"]

    return r.registrarUsuario(usuario, email, senha)