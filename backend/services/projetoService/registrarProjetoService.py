import models.projetos as p


class RegistrarProjetoService:
    def execute(self, dados):
        nome = dados["nome"]
        status = dados["status"]
        usuario_id = dados["usuario_id"]
        descricao = dados.get("descricao")
        logoProjeto = dados.get("logoProjeto")

        projeto = p.registrarProjeto(nome, status, usuario_id, descricao, logoProjeto)

        return {
            "mensagem": f"Projeto {nome} registrado com sucesso",
            "id": projeto.id
        }, 201
