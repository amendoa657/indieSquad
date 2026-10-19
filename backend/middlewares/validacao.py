# Confere se os campos obrigatorios chegaram no corpo do pedido.
#
# Devolve o nome do primeiro campo que faltou, ou None quando esta tudo certo.
# Antes disso o codigo acessava dados["nome"] direto, e um campo faltando
# derrubava a rota com erro 500 em vez de avisar o que faltou.
def campoFaltando(dados, campos):
    if dados is None:
        return campos[0]

    for campo in campos:
        valor = dados.get(campo)

        if valor is None:
            return campo

        if isinstance(valor, str) and valor.strip() == "":
            return campo

    return None


# Confere se o valor da pra virar numero inteiro dentro de um intervalo.
def inteiroNoIntervalo(valor, minimo, maximo):
    try:
        numero = int(valor)
    except (TypeError, ValueError):
        return None

    if numero < minimo or numero > maximo:
        return None

    return numero


# Limpa o texto que veio do front: tira espaco das pontas e corta no limite da
# coluna, pra um texto gigante nao estourar o banco.
def texto(valor, limite):
    if valor is None:
        return None

    return str(valor).strip()[:limite]
