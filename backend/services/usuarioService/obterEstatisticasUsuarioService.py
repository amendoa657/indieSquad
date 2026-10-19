import models.usuario as u
import models.avaliacao as a


# Os numeros publicos de um perfil: projetos, colaboracoes, taxa de conclusao e
# reputacao. Antes o perfil puxava isso do /dashboard, que e dado privado.
class ObterEstatisticasUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Usuario nao encontrado"}, 404

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
