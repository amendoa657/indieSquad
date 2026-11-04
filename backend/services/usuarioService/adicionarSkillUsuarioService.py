import models.skillUsuario as su
from models.skillUsuario import SkillUsuario
from middlewares.validacao import campoFaltando, inteiroNoIntervalo
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE
from repositories.skillRepository import SkillRepository
from repositories.usuarioRepository import UsuarioRepository

# quantas funcoes uma pessoa pode ter no perfil
LIMITE_SKILLS = 6


class AdicionarSkillUsuarioService:
    def execute(self, idUsuario, dados):
        faltando = campoFaltando(dados, ["idSkill"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        usuario = UsuarioRepository.buscarPorId(idUsuario)
        skill = SkillRepository.buscarPorId(dados["idSkill"])

        if usuario is None and skill is None:
            return {"erro": "Pessoa e função não encontradas"}, 404

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        if not ehOProprio(idUsuario):
            return ERRO_NAO_E_VOCE

        nivel = inteiroNoIntervalo(dados.get("nivel", 1), 1, 4)

        if nivel is None:
            return {"erro": "O nível deve ser de 1 (Iniciante) a 4 (Especialista)"}, 400

        for skillU in usuario.skills:
            if skillU.skills.id == skill.id:
                # ja tem a skill: em vez de recusar, atualiza o nivel
                skillU.nivel = nivel
                UsuarioRepository.salvar()

                return su.to_dict(skillU), 200

        if len(usuario.skills) >= LIMITE_SKILLS:
            return {"erro": f"Você pode ter no máximo {LIMITE_SKILLS} funções no perfil"}, 409

        vinculo = SkillUsuario(
            skills=skill,
            usuario=usuario,
            nivel=nivel
        )

        UsuarioRepository.adicionarSkill(usuario, vinculo)

        return su.to_dict(vinculo), 201
