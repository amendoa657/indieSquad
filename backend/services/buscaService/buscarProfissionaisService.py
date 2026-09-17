import models.usuario as u


class BuscarProfissionaisService:
    def execute(self, skillNome=None):
        usuarios = u.mostrarUsuarios()

        resultado = []
        for usuario in usuarios:
            skillsUsuario = [vinculo.skills.nome for vinculo in usuario.skills]

            if skillNome and skillNome != "Todos" and skillNome not in skillsUsuario:
                continue

            projetosCriados = usuario.projetosCriados
            totalProjetos = len(projetosCriados)
            concluidos = len([proj for proj in projetosCriados if proj.status == "concluido"])
            taxaConclusao = round((concluidos / totalProjetos) * 100) if totalProjetos > 0 else 0

            resultado.append({
                "id": usuario.id,
                "nome": usuario.usuario,
                "bio": usuario.bio,
                "skills": skillsUsuario,
                "projetosCriados": totalProjetos,
                "colaboracoes": len(usuario.participacoes),
                "taxaConclusao": taxaConclusao
            })

        return resultado, 200
