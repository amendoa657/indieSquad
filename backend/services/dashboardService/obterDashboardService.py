import models.usuario as u


class ObterDashboardService:
    def execute(self, idUsuario):
        usuario = u.buscarPorId(idUsuario)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

        projetosCriados = usuario.projetosCriados
        projetosAtivos = [proj for proj in projetosCriados if proj.status == "ativo"]
        concluidos = [proj for proj in projetosCriados if proj.status == "concluido"]

        totalProjetos = len(projetosCriados)
        taxaConclusao = round((len(concluidos) / totalProjetos) * 100) if totalProjetos > 0 else 0

        colaboracoes = len(usuario.participacoes)

        listaProjetos = []
        for projeto in projetosAtivos:
            totalVagas = len(projeto.vagas)
            vagasPreenchidas = len([vaga for vaga in projeto.vagas if vaga.status != "aberta"])
            progresso = round((vagasPreenchidas / totalVagas) * 100) if totalVagas > 0 else 0

            listaProjetos.append({
                "id": projeto.id,
                "nome": projeto.nome,
                "membros": len(projeto.membros),
                "progresso": progresso
            })

        return {
            "nome": usuario.usuario,
            "projetosAtivos": len(projetosAtivos),
            "colaboracoes": colaboracoes,
            "taxaConclusao": taxaConclusao,
            "totalProjetos": totalProjetos,
            "projetos": listaProjetos
        }, 200
