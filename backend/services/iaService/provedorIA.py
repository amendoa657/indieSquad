import json
import urllib.error
import urllib.request

from flask import current_app

# cliente de LLM no protocolo da OpenAI, que Groq e OpenRouter tambem falam


def configurado():
    return bool(current_app.config.get("IA_CHAVE"))


# devolve None em qualquer falha, e quem chamou usa o texto montado localmente
def conversar(instrucao, pergunta):
    if not configurado():
        return None

    corpo = json.dumps({
        "model": current_app.config["IA_MODELO"],
        "messages": [
            {"role": "system", "content": instrucao},
            {"role": "user", "content": pergunta},
        ],
        "temperature": 0.3,
        "max_tokens": 700,
    }).encode()

    pedido = urllib.request.Request(
        current_app.config["IA_URL"],
        data=corpo,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {current_app.config['IA_CHAVE']}",
        },
    )

    try:
        with urllib.request.urlopen(pedido, timeout=current_app.config["IA_TEMPO_LIMITE"]) as resposta:
            dados = json.loads(resposta.read())

        return dados["choices"][0]["message"]["content"]

    except (urllib.error.URLError, urllib.error.HTTPError, KeyError, IndexError, ValueError, TimeoutError) as erro:
        current_app.logger.warning(f"IA indisponivel, usando texto local: {erro}")
        return None


# o modelo as vezes devolve o JSON embrulhado em bloco de codigo
def lerJson(texto):
    if not texto:
        return None

    limpo = texto.strip()

    if limpo.startswith("```"):
        limpo = limpo.split("```")[1] if "```" in limpo[3:] else limpo[3:]
        limpo = limpo.removeprefix("json").strip()

    for abre, fecha in [("{", "}"), ("[", "]")]:
        inicio = limpo.find(abre)
        fim = limpo.rfind(fecha)

        if inicio == -1 or fim == -1 or fim < inicio:
            continue

        try:
            return json.loads(limpo[inicio:fim + 1])
        except ValueError:
            continue

    return None
