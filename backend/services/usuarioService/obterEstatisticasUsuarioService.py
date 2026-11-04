from repositories.usuarioRepository import UsuarioRepository
from services.avaliacaoService.reputacaoService import ReputacaoService


# numeros publicos do perfil: projetos, colaboracoes, conclusao e reputacao
class ObterEstatisticasUsuarioService:
    def execute(self, id):
        usuario = UsuarioRepository.buscarPorId(id)

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
            "reputacao": ReputacaoService.reputacao(usuario.id)
        }, 200
