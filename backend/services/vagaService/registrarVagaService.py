import models.vagaProjeto as v
import models.projetos as p
import models.skills as s
from middlewares.validacao import campoFaltando, texto, inteiroNoIntervalo
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class RegistrarVagaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["titulo", "idProjeto", "idSkill"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        projeto = p.buscarPorId(dados["idProjeto"])

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        skill = s.buscarPorId(dados["idSkill"])

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        nivelMinimo = dados.get("nivelMinimo")

        if nivelMinimo is not None:
            nivelMinimo = inteiroNoIntervalo(nivelMinimo, 1, 4)

            if nivelMinimo is None:
                return {"erro": "O nível mínimo deve ser de 1 a 4"}, 400

        vaga = v.registrarVagaProjeto(
            texto(dados["titulo"], 45),
            texto(dados.get("descricao"), 2000),
            "aberta",
            projeto.id,
            skill.id,
            nivelMinimo
        )

        return v.to_dict(vaga), 201
