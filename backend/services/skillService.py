import models.skills as s


def getSkills():

    lista = []

    for skill in s.getSkills():
        lista.append(s.to_dict(skill))

    return lista

def getSkill(id):
    skill = s.getSkill(id)

    return s.to_dict(skill)




def registrarSkill(dados):
    nome = dados["nome"]

    s.registrarSkill(nome)

    return f"Skill {nome} registrado com sucesso"


def alterarSkill(id, dados):
    skill = s.buscarPorId(id)

    nome = dados["nome"]

    skill.nome = nome

    s.salvar()

    return f"Skill {nome} alterado com sucesso"


def deletarSkill(id):
    skill = s.buscarPorId(id)

    s.deletarSkill(skill)

    return f"Skill {skill.nome} deletado com sucesso"





