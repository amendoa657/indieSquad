from services.iaService import provedorIA

# quantos candidatos ganham explicacao da IA, pedidos numa chamada so
LIMITE_EXPLICADOS = 3

INSTRUCAO = (
    "Voce ajuda criadores de jogos indie a entender por que um candidato combina com a vaga deles. "
    "Escreva em portugues do Brasil, em no maximo duas frases curtas por candidato, em tom direto e honesto. "
    "Use apenas os fatos que receber: nunca invente experiencia, nome de jogo ou habilidade. "
    "Quando um ponto for fraco, diga com naturalidade em vez de esconder. "
    "Responda somente um objeto JSON em que cada chave e o id do candidato e cada valor e a frase dele, "
    "assim: {\"7\": \"frase do candidato 7\", \"12\": \"frase do candidato 12\"}."
)


# texto que o sistema escreve sozinho quando a IA nao responde
def textoLocal(candidato):
    compatibilidade = candidato["compatibilidade"]
    fortes = compatibilidade["fortes"]
    fracos = compatibilidade["fracos"]

    if not fortes and not fracos:
        return "Perfil ainda sem dados suficientes pra comparar com a vaga."

    nome = candidato["usuario"]["usuario"].split(" ")[0]
    frases = []

    if fortes:
        frases.append(f"{nome} " + _juntar(fortes) + ".")

    if fracos:
        inicio = "Por outro lado," if fortes else f"{nome}"
        frases.append(f"{inicio} " + _juntar(fracos) + ".")

    return " ".join(frases)


# "a, b e c" em vez de "a, b, c"
def _juntar(partes):
    if len(partes) == 1:
        return partes[0]

    return ", ".join(partes[:-1]) + " e " + partes[-1]


CHAVES_TEXTO = ("texto", "explicacao", "frase", "motivo")


# o modelo nem sempre devolve no formato pedido, entao aceita as variacoes comuns
def _normalizar(resposta):
    if isinstance(resposta, dict) and isinstance(resposta.get("candidatos"), list):
        resposta = resposta["candidatos"]

    if isinstance(resposta, list):
        frases = {}

        for item in resposta:
            if not isinstance(item, dict) or item.get("id") is None:
                continue

            texto = next((item[chave] for chave in CHAVES_TEXTO if isinstance(item.get(chave), str)), None)

            if texto:
                frases[str(item["id"])] = texto

        return frases

    if isinstance(resposta, dict):
        return {str(id): texto for id, texto in resposta.items() if isinstance(texto, str)}

    return {}


def _montarPergunta(vaga, projeto, candidatos):
    linhas = [
        f"Projeto: {projeto.nome}",
        f"Descricao: {projeto.descricao or 'sem descricao'}",
        f"Engine: {projeto.engine or 'nao informada'}",
        f"Tipo de parceria: {projeto.tipoParceria or 'nao informado'}",
        f"Vaga: {vaga.titulo}",
        f"O que a vaga pede: {vaga.descricao or 'sem descricao'}",
        "",
        "Candidatos:",
    ]

    for candidato in candidatos:
        pessoa = candidato["usuario"]
        compatibilidade = candidato["compatibilidade"]
        fortes = "; ".join(compatibilidade["fortes"]) or "nenhum"
        fracos = "; ".join(compatibilidade["fracos"]) or "nenhum"

        linhas.append(
            f"- id {pessoa['id']} | {pessoa['usuario']} | compatibilidade {compatibilidade['nota']}%"
            f" | a favor: {fortes} | contra: {fracos}"
        )

    return "\n".join(linhas)


class ExplicarMatchService:
    def execute(self, vaga, projeto, candidatos):
        for candidato in candidatos:
            candidato["explicacao"] = textoLocal(candidato)
            candidato["explicadoPorIA"] = False

        primeiros = candidatos[:LIMITE_EXPLICADOS]

        if not primeiros:
            return candidatos

        resposta = provedorIA.conversar(INSTRUCAO, _montarPergunta(vaga, projeto, primeiros))
        frases = _normalizar(provedorIA.lerJson(resposta))

        if not frases:
            return candidatos

        for candidato in primeiros:
            frase = frases.get(str(candidato["usuario"]["id"]))

            if frase:
                candidato["explicacao"] = frase.strip()
                candidato["explicadoPorIA"] = True

        return candidatos
