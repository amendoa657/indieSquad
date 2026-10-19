import models.usuario as u
import models.projetos as p


class ListarProjetosUsuarioService:
    def execute(self, id):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        # os projetos que a pessoa criou, mais os que ela participa como membro
        projetos = list(usuario.projetosCriados)

        for participacao in usuario.participacoes:
            if participacao.projeto not in projetos:
                projetos.append(participacao.projeto)

        projetos.sort(key=lambda projeto: projeto.dataCriacao or 0, reverse=True)

        resultado = []
        for projeto in projetos:
            dados = p.to_dict(projeto)
            dados["ehCriador"] = projeto.criador_id == usuario.id
            resultado.append(dados)

        return resultado, 200
