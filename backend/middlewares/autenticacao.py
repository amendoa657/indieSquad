import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, current_app, g

import models.usuario as u


# Monta o token que o front guarda depois do login.
#
# O token leva o id de quem entrou e a hora em que ele expira, e sai assinado
# com a SECRET_KEY do servidor. Qualquer pessoa consegue LER o conteudo, mas
# ninguem consegue trocar o id sem invalidar a assinatura. Era exatamente isso
# que faltava antes: o token era o texto "usuario-6", e bastava digitar
# "usuario-9" no navegador pra virar outra pessoa.
def gerarToken(usuario):
    carga = {
        "idUsuario": usuario.id,
        "handle": usuario.handle,
        "exp": datetime.now(timezone.utc) + timedelta(hours=current_app.config["HORAS_EXPIRACAO_TOKEN"])
    }

    return jwt.encode(carga, current_app.config["SECRET_KEY"], algorithm="HS256")


# Confere a assinatura e a validade. Token mexido ou vencido devolve None.
def lerToken(token):
    try:
        return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


# O token chega no cabecalho no formato "Authorization: Bearer <token>".
def tokenDoPedido():
    cabecalho = request.headers.get("Authorization", "")

    if not cabecalho.startswith("Bearer "):
        return None

    return cabecalho[7:].strip()


# Devolve o usuario logado, ou None quando nao tem token valido.
#
# O resultado fica guardado no "g", que e uma memoria que vive so durante esse
# pedido. Assim o mesmo pedido nao consulta o banco varias vezes pela mesma
# pessoa.
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

    g.usuarioLogado = u.buscarPorId(carga["idUsuario"])

    return g.usuarioLogado


def idUsuarioLogado():
    usuario = usuarioLogado()

    return usuario.id if usuario else None


# Confere se quem esta logado e a propria pessoa do id que veio na URL.
def ehOProprio(id):
    usuario = usuarioLogado()

    return usuario is not None and usuario.id == int(id)


# Decorator que barra o pedido antes de entrar no controller.
#
# Basta escrever @exigirLogin em cima do metodo pra ele virar privado.
def exigirLogin(funcao):
    @wraps(funcao)
    def dentro(*args, **kwargs):
        if usuarioLogado() is None:
            return {"erro": "Precisa estar logado"}, 401

        return funcao(*args, **kwargs)

    return dentro


# Confere se quem esta logado e o criador do projeto.
#
# Essa checagem fica no service, junto com o resto das regras de negocio: antes
# dela existir, a tela so ESCONDIA os botoes de dono, e quem chamasse a API na
# mao conseguia aceitar candidatura e apagar projeto de qualquer pessoa.
def ehDonoDoProjeto(projeto):
    return projeto is not None and projeto.criador_id == idUsuarioLogado()


ERRO_NAO_E_DONO = ({"erro": "So o criador do projeto pode fazer isso"}, 403)
ERRO_NAO_E_VOCE = ({"erro": "Voce so pode mexer na sua propria conta"}, 403)
