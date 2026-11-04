import models.skills as s
from middlewares.validacao import campoFaltando, texto
from repositories.skillRepository import SkillRepository


# o catalogo de funcoes vem pronto no seed do banco
class RegistrarSkillService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["nome"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        nome = texto(dados["nome"], 90)

        if SkillRepository.buscarPorNome(nome):
            return {"erro": "Essa função já existe"}, 409

        skill = SkillRepository.registrarSkill(nome, texto(dados.get("categoria"), 45) or "Outro")

        return s.to_dict(skill), 201
