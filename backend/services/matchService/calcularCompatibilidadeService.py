import models.avaliacao as a
import models.skillUsuario as su
from services.matchService import similaridadeTexto

# quanto cada criterio vale no total de 100, numa constante pra nota ser explicavel
PESOS = {
    "funcao": 35,
    "nivel": 15,
    "parceria": 15,
    "ferramenta": 10,
    "disponibilidade": 10,
    "reputacao": 10,
    "texto": 5,
}

# acima disso a disponibilidade ja conta como total
HORAS_IDEAIS = 20


def _funcao(usuario, vaga):
    skillDaVaga = vaga.skill

    for vinculo in usuario.skills:
        if vinculo.skills.id == skillDaVaga.id:
            return 1.0, (True, f"tem a função {skillDaVaga.nome}, que é a da vaga")

    for vinculo in usuario.skills:
        if vinculo.skills.categoria == skillDaVaga.categoria:
            return 0.5, (False, f"trabalha em {skillDaVaga.categoria}, mas não com {skillDaVaga.nome}")

    return 0.0, (False, f"não tem {skillDaVaga.nome} no perfil")


def _nivel(usuario, vaga):
    if not vaga.nivelMinimo:
        return 1.0, None

    for vinculo in usuario.skills:
        if vinculo.skills.id == vaga.skills_id:
            if vinculo.nivel >= vaga.nivelMinimo:
                return 1.0, (True, f"está em {su.nomeDoNivel(vinculo.nivel)}, o nível que a vaga pede")

            return vinculo.nivel / vaga.nivelMinimo, (
                False,
                f"está em {su.nomeDoNivel(vinculo.nivel)} e a vaga pede {su.nomeDoNivel(vaga.nivelMinimo)}",
            )

    return 0.0, None


def _parceria(usuario, projeto):
    if not projeto.tipoParceria:
        return 0.5, None

    aceita = {
        "portfolio": usuario.aceitaPortfolio,
        "revenueShare": usuario.aceitaRevenueShare,
        "remunerado": usuario.aceitaRemunerado,
    }

    nomes = {
        "portfolio": "portfólio",
        "revenueShare": "divisão de lucro",
        "remunerado": "trabalho remunerado",
    }

    nome = nomes.get(projeto.tipoParceria, projeto.tipoParceria)

    if aceita.get(projeto.tipoParceria):
        return 1.0, (True, f"aceita {nome}, que é a parceria do projeto")

    return 0.0, (False, f"não marcou que aceita {nome}")


def _ferramenta(usuario, projeto):
    if not projeto.engine:
        return 0.5, None

    for vinculo in usuario.ferramentas:
        if vinculo.ferramenta.nome.lower() == projeto.engine.lower():
            return 1.0, (True, f"já usa {projeto.engine}")

    return 0.0, (False, f"não marcou {projeto.engine} nas ferramentas")


def _disponibilidade(usuario):
    if not usuario.disponibilidadeHoras:
        return 0.3, None

    horas = usuario.disponibilidadeHoras
    nota = min(horas / HORAS_IDEAIS, 1.0)

    return nota, (nota >= 0.5, f"tem {horas}h por semana")


def _reputacao(usuario):
    reputacao = a.reputacao(usuario.id)

    # quem ainda nao foi avaliado fica no meio, nem premiado nem punido
    if reputacao["total"] == 0:
        return 0.5, None

    media = f"{reputacao['media']:.1f}".replace(".", ",")
    quantidade = "1 avaliação" if reputacao["total"] == 1 else f"{reputacao['total']} avaliações"

    return reputacao["media"] / 5, (reputacao["media"] >= 3, f"tem nota {media} em {quantidade}")


class CalcularCompatibilidadeService:
    def execute(self, usuario, vaga, projeto, idf=None):
        criterios = {}
        fortes = []
        fracos = []

        for chave, (nota, motivo) in {
            "funcao": _funcao(usuario, vaga),
            "nivel": _nivel(usuario, vaga),
            "parceria": _parceria(usuario, projeto),
            "ferramenta": _ferramenta(usuario, projeto),
            "disponibilidade": _disponibilidade(usuario),
            "reputacao": _reputacao(usuario),
        }.items():
            criterios[chave] = nota

            if motivo:
                bom, texto = motivo
                (fortes if bom else fracos).append(texto)

        if idf is not None:
            textoDaVaga = f"{projeto.nome} {projeto.descricao or ''} {vaga.titulo} {vaga.descricao or ''}"
            textoDaPessoa = f"{usuario.bio or ''} " + " ".join(v.skills.nome for v in usuario.skills)
            criterios["texto"] = similaridadeTexto.similaridade(textoDaVaga, textoDaPessoa, idf)
        else:
            criterios["texto"] = 0.0

        pontos = sum(criterios[chave] * PESOS[chave] for chave in PESOS)

        return {
            "nota": round(pontos),
            "criterios": {chave: round(criterios[chave] * PESOS[chave]) for chave in PESOS},
            "pesos": PESOS,
            "fortes": fortes,
            "fracos": fracos,
        }
