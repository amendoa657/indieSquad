import models.usuario as u
import models.projetos as p
import models.avaliacao as a


# Os numeros que a landing mostra. Antes eles eram escritos na mao no HTML
# ("93%", "2.4k+", "380+") e nao vinham de lugar nenhum.
class ObterEstatisticasPublicasService:
    def execute(self):
        usuarios = u.mostrarUsuarios()
        projetos = p.mostrarProjetos()

        concluidos = [projeto for projeto in projetos if projeto.status == "concluido"]
        taxaConclusao = round((len(concluidos) / len(projetos)) * 100) if projetos else 0

        # Quantas pessoas ja tem pelo menos uma funcao no perfil. E o numero
        # honesto de "profissionais": quem so criou conta e nao preencheu nada
        # nao conta.
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
