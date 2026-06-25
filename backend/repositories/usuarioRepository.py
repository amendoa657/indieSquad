from models.usuario import Usuario
from database.database import db


def mostrarUsuario(id):
    return Usuario.query.get(id)

def mostrarUsuarios():
    return Usuario.query.all()

def registrarUsuario(usuario, email, senha):
    usuarioTable = Usuario(
        usuario=usuario,
        email=email,
        senha=senha
    )

    db.session.add(usuarioTable)
    db.session.commit()

    return f"Usuario {usuario} registrado com sucesso"