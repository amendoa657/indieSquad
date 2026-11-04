import models.vagaProjeto as v
from middlewares.validacao import texto, inteiroNoIntervalo
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO
from repositories.skillRepository import SkillRepository
from repositories.vagaProjetoRepository import VagaProjetoRepository


class AtualizarVagaService:
    def execute(self, id, dados):
        vaga = VagaProjetoRepository.buscarPorId(id)

        if vaga is None:
            return {"erro": "Vaga não encontrada"}, 404

        if not ehDonoDoProjeto(v.getProjeto(vaga)):
            return ERRO_NAO_E_DONO

        if dados is None:
            return {"erro": "Nenhum dado foi enviado"}, 400

        if "titulo" in dados:
            titulo = texto(dados["titulo"], 45)

            if not titulo:
                return {"erro": "O título não pode ficar vazio"}, 400

            vaga.titulo = titulo

        if "descricao" in dados:
            vaga.descricao = texto(dados["descricao"], 2000)

        if "status" in dados:
            if not v.statusValido(dados["status"]):
                return {"erro": "Status inválido"}, 400

            vaga.status = dados["status"]

        if "nivelMinimo" in dados:
            if dados["nivelMinimo"] is None:
                vaga.nivelMinimo = None
            else:
                nivel = inteiroNoIntervalo(dados["nivelMinimo"], 1, 4)

                if nivel is None:
                    return {"erro": "O nível mínimo deve ser de 1 a 4"}, 400

                vaga.nivelMinimo = nivel

        if "idSkill" in dados:
            skill = SkillRepository.buscarPorId(dados["idSkill"])

            if skill is None:
                return {"erro": "Função não encontrada"}, 404

            vaga.skills_id = skill.id

        # mover a vaga pra outro projeto trocaria o dono e furaria a autorizacao

        VagaProjetoRepository.salvar()

        return v.to_dict(vaga), 200
