import models.usuario as u
import models.skills as s
import models.skillUsuario as su
from models.skillUsuario import SkillUsuario
from middlewares.validacao import campoFaltando, inteiroNoIntervalo
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE

# Quantas funcoes uma pessoa pode ter no perfil. Sem limite, todo mundo marca
# tudo e a busca por funcao perde o sentido.
LIMITE_SKILLS = 6


class AdicionarSkillUsuarioService:
    def execute(self, idUsuario, dados):
        faltando = campoFaltando(dados, ["idSkill"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        usuario = u.buscarPorId(idUsuario)
        skill = s.buscarPorId(dados["idSkill"])

        if usuario is None and skill is None:
            return {"erro": "Usuario e skill nao encontrados"}, 404

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        if skill is None:
            return {"erro": "skill nao encontrado"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        nivel = inteiroNoIntervalo(dados.get("nivel", 1), 1, 4)

        if nivel is None:
            return {"erro": "O nivel deve ser de 1 (Iniciante) a 4 (Especialista)"}, 400

        for skillU in usuario.skills:
            if skillU.skills.id == skill.id:
                # Ja tem a skill: em vez de recusar, atualiza o nivel.
                skillU.nivel = nivel
                u.salvar()

                return su.to_dict(skillU), 200

        if len(usuario.skills) >= LIMITE_SKILLS:
            return {"erro": f"Voce pode ter no maximo {LIMITE_SKILLS} funcoes no perfil"}, 409

        vinculo = SkillUsuario(
            skills=skill,
            usuario=usuario,
            nivel=nivel
        )

        u.adicionarSkill(usuario, vinculo)

        return su.to_dict(vinculo), 201
