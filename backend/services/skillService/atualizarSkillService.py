import models.skills as s
from middlewares.validacao import campoFaltando, texto


class AtualizarSkillService:
    def execute(self, id, dados):
        skill = s.buscarPorId(id)

        if skill is None:
            return {"erro": "Skill nao encontrado"}, 404

        if dados is None:
            return {"erro": "Nenhum dado foi enviado"}, 400

        if "nome" in dados:
            faltando = campoFaltando(dados, ["nome"])

            if faltando:
                return {"erro": "O nome nao pode ficar vazio"}, 400

            nome = texto(dados["nome"], 90)
            emUso = s.buscarPorNome(nome)

            if emUso and emUso.id != skill.id:
                return {"erro": "Essa skill ja existe"}, 409

            skill.nome = nome

        if "categoria" in dados:
            skill.categoria = texto(dados["categoria"], 45) or "Outro"

        s.salvar()

        return s.to_dict(skill), 200
