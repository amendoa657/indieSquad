import models.usuario as u
import models.avaliacao as a


# numeros publicos do perfil: projetos, colaboracoes, conclusao e reputacao
class ObterEstatisticasUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        projetosCriados = usuario.projetosCriados
        totalProjetos = len(projetosCriados)
        concluidos = len([projeto for projeto in projetosCriados if projeto.status == "concluido"])
        taxaConclusao = round((concluidos / totalProjetos) * 100) if totalProjetos > 0 else 0

        return {
            "totalProjetos": totalProjetos,
            "projetosConcluidos": concluidos,
            "colaboracoes": len(usuario.participacoes),
            "taxaConclusao": taxaConclusao,
            "reputacao": a.reputacao(usuario.id)
        }, 200
