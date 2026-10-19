import models.usuario as u
import models.projetos as p
import models.avaliacao as a


# os numeros que a landing mostra
class ObterEstatisticasPublicasService:
    def execute(self):
        usuarios = u.mostrarUsuarios()
        projetos = p.mostrarProjetos()

        concluidos = [projeto for projeto in projetos if projeto.status == "concluido"]
        taxaConclusao = round((len(concluidos) / len(projetos)) * 100) if projetos else 0

        # quantas pessoas ja tem pelo menos uma funcao no perfil
        profissionais = len([usuario for usuario in usuarios if usuario.skills])

        totalAvaliacoes = len(a.mostrarAvaliacoes())

        return {
            "usuarios": len(usuarios),
            "profissionais": profissionais,
            "projetos": len(projetos),
            "projetosConcluidos": len(concluidos),
            "taxaConclusao": taxaConclusao,
            "avaliacoes": totalAvaliacoes
        }, 200
