import models.projetos as p


class BuscarProjetosPublicoService:
    def execute(self, termo=None, genero=None, engine=None, tipoParceria=None, status=None):
        projetos = p.mostrarProjetos()

        resultado = []
        for projeto in projetos:
            if termo and termo.lower() not in (projeto.nome or "").lower():
                continue

            if genero and genero != "Todos" and (projeto.genero or "") != genero:
                continue

            if engine and engine != "Todos" and (projeto.engine or "") != engine:
                continue

            if tipoParceria and tipoParceria != "Todos" and (projeto.tipoParceria or "") != tipoParceria:
                continue

            if status and status != "Todos" and projeto.status != status:
                continue

            resultado.append({
                "id": projeto.id,
                "nome": projeto.nome,
                "descricao": projeto.descricao,
                "status": projeto.status,
                "genero": projeto.genero,
                "engine": projeto.engine,
                "tipoParceria": projeto.tipoParceria,
                "duracaoEstimada": projeto.duracaoEstimada,
                "totalMembros": len(projeto.membros),
                "vagasAbertas": len([vaga for vaga in projeto.vagas if vaga.status == "aberta"]),
                "criador": {
                    "id": projeto.criador.id,
                    "handle": projeto.criador.handle,
                    "usuario": projeto.criador.usuario
                }
            })

        return resultado, 200
