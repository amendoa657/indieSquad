import models.usuario as u
import models.projeto as p
import models.skills as s

from models.skillUsuario import SkillUsuario


def mostrarProjeto(id):
    usuario = u.buscarPorId(id)

    if (usuario == None):
        return {"erro": "Usuario nao encontrado"}, 404

    lista = []

    for projeto in usuario.projetosCriados:
        lista.append(p.to_dict(projeto))

    return lista




def mostrarUsuarios():
    usuarios = u.mostrarUsuarios()

    lista = []

    for user in usuarios:
        lista.append(u.to_dict(user))

    return lista

def mostrarUsuario(id):
    usuario = u.mostrarUsuario(id)

    if (usuario == None):
        return {"erro": "Usuario nao encontrado"}, 404

    usuarioD = u.to_dict(usuario)

    return usuarioD

def alterarUsuario(id, dados):
    usuario = u.buscarPorId(id)

    if(usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404


    if "usuario" in dados:
        usuario.usuario = dados["usuario"]

    if "email" in dados:
        usuario.email = dados["email"]

    if "senha" in dados:
        usuario.senha = dados["senha"]

    if "bio" in dados:
        usuario.bio = dados["bio"]

    if "fotoDePerfil" in dados:
        usuario.fotoDePerfil = dados["fotoDePerfil"]

    u.salvar()

    return "Usuario alterado com sucesso",200

def deletarUsuario(id):
    Usuario = u.buscarPorId(id)

    if(Usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404

    u.deletarUsuario(Usuario)

    return "Usuario deletado com sucesso",200


def getSkillsUsuario(id):
    usuario = u.buscarPorId(id)

    if(usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404

    lista = []

    for skill in u.getSkillsUsuario(usuario):
        lista.append(s.to_dict(skill.skills))

    return lista


def adicionarSkill(idUsuario, dados):
    usuario = u.buscarPorId(idUsuario)
    skill = s.buscarPorId(dados["idSkill"])
    nivel = int(dados["nivel"])

    for skillU in usuario.skills:
        if(skillU.skills.id == skill.id):
            return {"erro" : "O usuario ja tem essa skill"}, 409

    if(usuario == None and skill == None):
        return {"erro" : "Usuario e skill nao encontrados"}, 404

    if(usuario == None):
        return {"erro" : "Usuario nao encontrado"}, 404

    if(skill == None):
        return {"erro" : "skill nao encontrado"}, 404

    skillT = SkillUsuario(
        skills=skill,
        usuario=usuario,
        nivel=nivel
    )

    u.adicionarSkill(usuario, skillT)

    return f"A skill {skill.nome} foi adicionada com sucesso!"


def removerSkill(idUsuario, idSkill):
    usuario = u.buscarPorId(idUsuario)
    skill = s.buscarPorId(idSkill)

    if (skill == None and usuario == None):
        return {"erro": "Skill e usuarios nao encontrados"}, 404

    if (skill == None):
        return {"erro": "Skill nao encontrado"}, 404

    if (usuario == None):
        return {"erro": "Usuario nao encontrado"}, 404

    skillT = SkillUsuario.query.filter_by(
        skills_id=skill.id,
        usuario_id=usuario.id
    ).first()

    u.removerSkill(usuario, skillT)

    return f"A skill {skill.nome} foi removida com sucesso!"



