import models.usuario as u
import models.skillUsuario as su
import models.avaliacao as a


class BuscarProfissionaisService:
    def execute(self, skillNome=None, termo=None, objetivo=None, tipoColaboracao=None, horasMinimas=None):
        usuarios = u.mostrarUsuarios()

        resultado = []
        for usuario in usuarios:
            skillsUsuario = [vinculo.skills.nome for vinculo in usuario.skills]

            if skillNome and skillNome != "Todos" and skillNome not in skillsUsuario:
                continue

            # O filtro por nome agora acontece aqui, no servidor. Antes o front
            # baixava todo mundo e filtrava no navegador.
            if termo:
                alvo = f"{usuario.usuario} {usuario.handle}".lower()

                if termo.lower() not in alvo:
                    continue

            if objetivo and objetivo != "Todos":
                if usuario.objetivo != objetivo and usuario.objetivo != "ambos":
                    continue

            if tipoColaboracao == "portfolio" and not usuario.aceitaPortfolio:
                continue

            if tipoColaboracao == "revenueShare" and not usuario.aceitaRevenueShare:
                continue

            if tipoColaboracao == "remunerado" and not usuario.aceitaRemunerado:
                continue

            if horasMinimas:
                if usuario.disponibilidadeHoras is None or usuario.disponibilidadeHoras < int(horasMinimas):
                    continue

            projetosCriados = usuario.projetosCriados
            totalProjetos = len(projetosCriados)
            concluidos = len([projeto for projeto in projetosCriados if projeto.status == "concluido"])
            taxaConclusao = round((concluidos / totalProjetos) * 100) if totalProjetos > 0 else 0

            resultado.append({
                "id": usuario.id,
                "handle": usuario.handle,
                "nome": usuario.usuario,
                "bio": usuario.bio,
                "objetivo": usuario.objetivo,
                "disponibilidadeHoras": usuario.disponibilidadeHoras,
                "aceitaPortfolio": usuario.aceitaPortfolio,
                "aceitaRevenueShare": usuario.aceitaRevenueShare,
                "aceitaRemunerado": usuario.aceitaRemunerado,
                "skills": [su.to_dict(vinculo) for vinculo in usuario.skills],
                "projetosCriados": totalProjetos,
                "colaboracoes": len(usuario.participacoes),
                "taxaConclusao": taxaConclusao,
                "reputacao": a.reputacao(usuario.id)
            })

        # Quem tem melhor reputacao aparece primeiro, e so depois quem tem mais
        # projeto. Perfil vazio cai pro fim da lista naturalmente.
        resultado.sort(
            key=lambda pessoa: (pessoa["reputacao"]["media"], pessoa["reputacao"]["total"], pessoa["projetosCriados"]),
            reverse=True
        )

        return resultado, 200
