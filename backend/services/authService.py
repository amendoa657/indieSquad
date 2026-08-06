import models.usuario as r


def registrar(dados):
    usuario = dados["usuario"]
    email = dados["email"]
    senha = dados["senha"]

    r.registrarUsuario(usuario, email, senha)

    return f"O usuario {usuario} foi registrado com sucesso!"