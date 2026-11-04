import models.vagaProjeto as v
from middlewares.validacao import campoFaltando, texto, inteiroNoIntervalo
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.projetoRepository import ProjetoRepository
from repositories.skillRepository import SkillRepository
from repositories.vagaProjetoRepository import VagaProjetoRepository


class RegistrarVagaService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["titulo", "idProjeto", "idSkill"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        projeto = ProjetoRepository.buscarPorId(dados["idProjeto"])

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        skill = SkillRepository.buscarPorId(dados["idSkill"])

        if skill is None:
            return {"erro": "Função não encontrada"}, 404

        nivelMinimo = dados.get("nivelMinimo")

        if nivelMinimo is not None:
            nivelMinimo = inteiroNoIntervalo(nivelMinimo, 1, 4)

            if nivelMinimo is None:
                return {"erro": "O nível mínimo deve ser de 1 a 4"}, 400

        vaga = VagaProjetoRepository.registrarVagaProjeto(
            texto(dados["titulo"], 45),
            texto(dados.get("descricao"), 2000),
            "aberta",
            projeto.id,
            skill.id,
            nivelMinimo
        )

        return v.to_dict(vaga), 201
