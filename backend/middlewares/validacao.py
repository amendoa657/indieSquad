# confere se os campos obrigatorios chegaram no corpo do pedido
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


# confere se o valor da pra virar numero inteiro dentro de um intervalo
def inteiroNoIntervalo(valor, minimo, maximo):
    try:
        numero = int(valor)
    except (TypeError, ValueError):
        return None

    if numero < minimo or numero > maximo:
        return None

    return numero


# tira espaco das pontas e corta no limite da coluna
def texto(valor, limite):
    if valor is None:
        return None

    return str(valor).strip()[:limite]
