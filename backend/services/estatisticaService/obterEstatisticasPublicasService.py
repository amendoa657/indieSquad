from repositories.avaliacaoRepository import AvaliacaoRepository
from repositories.projetoRepository import ProjetoRepository
from repositories.usuarioRepository import UsuarioRepository


# os numeros que a landing mostra
class ObterEstatisticasPublicasService:
    def execute(self):
        usuarios = UsuarioRepository.mostrarUsuarios()
        projetos = ProjetoRepository.mostrarProjetos()

        concluidos = [projeto for projeto in projetos if projeto.status == "concluido"]
        taxaConclusao = round((len(concluidos) / len(projetos)) * 100) if projetos else 0

        # quantas pessoas ja tem pelo menos uma funcao no perfil
        profissionais = len([usuario for usuario in usuarios if usuario.skills])

        totalAvaliacoes = len(AvaliacaoRepository.mostrarAvaliacoes())

        return {
            "usuarios": len(usuarios),
            "profissionais": profissionais,
            "projetos": len(projetos),
            "projetosConcluidos": len(concluidos),
            "taxaConclusao": taxaConclusao,
            "avaliacoes": totalAvaliacoes
        }, 200
