import math
import re
import unicodedata
from collections import Counter

# palavras que aparecem em quase todo texto e nao ajudam a diferenciar nada
VAZIAS = {
    "a", "o", "e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas",
    "um", "uma", "uns", "umas", "para", "pra", "por", "com", "sem", "que", "se",
    "ao", "aos", "as", "os", "ou", "mais", "muito", "ja", "meu", "minha", "seu",
    "sua", "eu", "voce", "ele", "ela", "nao", "sim", "the", "of", "and", "to",
}


def normalizar(texto):
    texto = unicodedata.normalize("NFD", (texto or "").lower())
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")

    return texto


def palavras(texto):
    achadas = re.findall(r"[a-z0-9]{3,}", normalizar(texto))

    return [palavra for palavra in achadas if palavra not in VAZIAS]


# tf-idf: a palavra pesa mais quando aparece muito num texto e pouco nos outros
def calcularIdf(documentos):
    total = len(documentos)
    aparicoes = Counter()

    for documento in documentos:
        for palavra in set(palavras(documento)):
            aparicoes[palavra] += 1

    return {
        palavra: math.log((total + 1) / (quantidade + 1)) + 1
        for palavra, quantidade in aparicoes.items()
    }


def vetor(texto, idf):
    contagem = Counter(palavras(texto))

    if not contagem:
        return {}

    maior = max(contagem.values())

    return {
        palavra: (quantidade / maior) * idf.get(palavra, 1.0)
        for palavra, quantidade in contagem.items()
    }


# cosseno entre os dois vetores: 0 nao tem nada em comum, 1 e identico
def similaridade(textoA, textoB, idf):
    a = vetor(textoA, idf)
    b = vetor(textoB, idf)

    if not a or not b:
        return 0.0

    comuns = set(a) & set(b)
    produto = sum(a[palavra] * b[palavra] for palavra in comuns)

    tamanhoA = math.sqrt(sum(valor ** 2 for valor in a.values()))
    tamanhoB = math.sqrt(sum(valor ** 2 for valor in b.values()))

    if tamanhoA == 0 or tamanhoB == 0:
        return 0.0

    return produto / (tamanhoA * tamanhoB)
