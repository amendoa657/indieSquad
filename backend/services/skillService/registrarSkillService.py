import models.skills as s
from middlewares.validacao import campoFaltando, texto


# O catalogo de funcoes vem pronto no seed do banco. Essa rota existe pra
# manutencao do catalogo, nao pro usuario criar funcao digitando: era assim que
# o banco acabava com "Programador", "programador" e "Progamador" juntos.
class RegistrarSkillService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["nome"])

        if faltando:
            return {"erro": f"O campo {faltando} e obrigatorio"}, 400

        nome = texto(dados["nome"], 90)

        if s.buscarPorNome(nome):
            return {"erro": "Essa skill ja existe"}, 409

        skill = s.registrarSkill(nome, texto(dados.get("categoria"), 45) or "Outro")

        return s.to_dict(skill), 201
