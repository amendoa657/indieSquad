import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, current_app, g

from repositories.usuarioRepository import UsuarioRepository


# monta o token que o front guarda depois do login
def gerarToken(usuario):
    carga = {
        "idUsuario": usuario.id,
        "handle": usuario.handle,
        "exp": datetime.now(timezone.utc) + timedelta(hours=current_app.config["HORAS_EXPIRACAO_TOKEN"])
    }

    return jwt.encode(carga, current_app.config["SECRET_KEY"], algorithm="HS256")


# confere a assinatura e a validade
def lerToken(token):
    try:
        return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


# o token chega no cabecalho no formato "Authorization: Bearer <token>"
def tokenDoPedido():
    cabecalho = request.headers.get("Authorization", "")

    if not cabecalho.startswith("Bearer "):
        return None

    return cabecalho[7:].strip()


# devolve o usuario logado, ou None quando nao tem token valido
def usuarioLogado():
    if "usuarioLogado" in g:
        return g.usuarioLogado

    g.usuarioLogado = None

    token = tokenDoPedido()

    if token is None:
        return None

    carga = lerToken(token)

    if carga is None:
        return None

    g.usuarioLogado = UsuarioRepository.buscarPorId(carga["idUsuario"])

    return g.usuarioLogado


def idUsuarioLogado():
    usuario = usuarioLogado()

    return usuario.id if usuario else None


# confere se quem esta logado e a propria pessoa do id que veio na URL
def ehOProprio(id):
    usuario = usuarioLogado()

    return usuario is not None and usuario.id == int(id)


# decorator que barra o pedido antes de entrar no controller
def exigirLogin(funcao):
    @wraps(funcao)
    def dentro(*args, **kwargs):
        if usuarioLogado() is None:
            return {"erro": "Precisa estar logado"}, 401

        return funcao(*args, **kwargs)

    return dentro


# confere se quem esta logado e o criador do projeto
def ehDonoDoProjeto(projeto):
    return projeto is not None and projeto.criador_id == idUsuarioLogado()


ERRO_NAO_E_DONO = ({"erro": "Só o criador do projeto pode fazer isso"}, 403)
ERRO_NAO_E_VOCE = ({"erro": "Você só pode mexer na sua própria conta"}, 403)
