import models.projetos as p


class BuscarProjetosPublicoService:
    def execute(self, termo=None):
        projetos = p.mostrarProjetos()

        resultado = []
        for projeto in projetos:
            if termo and termo.lower() not in projeto.nome.lower():
                continue

            resultado.append({
                "id": projeto.id,
                "nome": projeto.nome,
                "descricao": projeto.descricao,
                "status": projeto.status,
                "vagasAbertas": len([v for v in projeto.vagas if v.status == "aberta"])
            })

        return resultado, 200
