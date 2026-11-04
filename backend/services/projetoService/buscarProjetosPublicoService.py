from repositories.projetoRepository import ProjetoRepository


class BuscarProjetosPublicoService:
    def execute(self, termo=None, genero=None, engine=None, tipoParceria=None, status=None):
        # o filtro acontece no banco, em SQL, e nao em memoria
        projetos = ProjetoRepository.buscarProjetosPublicos(
            termo=termo,
            genero=genero,
            engine=engine,
            tipoParceria=tipoParceria,
            status=status
        )

        resultado = []
        for projeto in projetos:
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
