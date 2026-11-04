import models.skillUsuario as su
from repositories.usuarioRepository import UsuarioRepository
from services.avaliacaoService.reputacaoService import ReputacaoService


class BuscarProfissionaisService:
    def execute(self, skillNome=None, termo=None, objetivo=None, tipoColaboracao=None, horasMinimas=None, categoria=None):
        # o filtro acontece no banco, em SQL, e nao em memoria
        usuarios = UsuarioRepository.buscarProfissionais(
            skillNome=skillNome,
            termo=termo,
            objetivo=objetivo,
            tipoColaboracao=tipoColaboracao,
            horasMinimas=horasMinimas,
            categoria=categoria
        )

        resultado = []
        for usuario in usuarios:
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
                "reputacao": ReputacaoService.reputacao(usuario.id)
            })

        # quem tem melhor reputacao aparece primeiro, e so depois quem tem mais projeto
        resultado.sort(
            key=lambda pessoa: (pessoa["reputacao"]["media"], pessoa["reputacao"]["total"], pessoa["projetosCriados"]),
            reverse=True
        )

        return resultado, 200
