import models.projetos as p
from middlewares.autenticacao import idUsuarioLogado
from middlewares.validacao import campoFaltando, texto
from repositories.marcoProjetoRepository import MarcoProjetoRepository
from repositories.projetoRepository import ProjetoRepository

LIMITE_MARCOS = 10


class RegistrarProjetoService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["nome"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        status = dados.get("status", "ativo")

        if not p.statusValido(status):
            return {"erro": "Status inválido"}, 400

        # o criador e sempre quem esta logado
        projeto = ProjetoRepository.registrarProjeto(
            texto(dados["nome"], 90),
            status,
            idUsuarioLogado(),
            texto(dados.get("descricao"), 5000),
            texto(dados.get("logoProjeto"), 255)
        )

        projeto.genero = texto(dados.get("genero"), 45)
        projeto.engine = texto(dados.get("engine"), 45)
        projeto.tipoParceria = texto(dados.get("tipoParceria"), 45)
        projeto.duracaoEstimada = texto(dados.get("duracaoEstimada"), 45)
        ProjetoRepository.salvar()

        for ordem, titulo in enumerate(dados.get("marcos", [])[:LIMITE_MARCOS], start=1):
            limpo = texto(titulo, 90)

            if limpo:
                MarcoProjetoRepository.registrarMarco(limpo, ordem, projeto.id)

        return p.to_dict(projeto), 201
