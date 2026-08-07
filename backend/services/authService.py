import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario


def gerarToken(usuario):
    # Token provisorio, so pra fechar o fluxo login -> dashboard.
    return f"usuario-{usuario.id}"


def registrar(dados):
    nome = dados["nome"]
    email = dados["email"]
    senha = dados["senha"]
    especialidade = dados.get("especialidade")

    if u.buscarPorEmail(email):
        return {"erro": "E-mail ja cadastrado"}, 409

    usuario = u.registrarUsuario(nome, email, senha)

    if especialidade:
        skill = s.Skills.query.filter_by(nome=especialidade).first()

        if not skill:
            s.registrarSkill(especialidade)
            skill = s.Skills.query.filter_by(nome=especialidade).first()

        vinculo = SkillUsuario(
            skills=skill,
            usuario=usuario,
            nivel=1
        )

        u.adicionarSkill(usuario, vinculo)

    token = gerarToken(usuario)

    return {"token": token}, 201


def login(dados):
    email = dados["email"]
    senha = dados["senha"]

    usuario = u.buscarPorEmail(email)

    if usuario is None or usuario.senha != senha:
        return {"erro": "Credenciais invalidas"}, 401

    token = gerarToken(usuario)

    return {"token": token}, 200