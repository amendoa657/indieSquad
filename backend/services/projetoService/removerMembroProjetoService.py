import models.projetos as p
import models.usuario as u
from models.membroProjeto import MembroProjeto
from middlewares.autenticacao import ehDonoDoProjeto, ERRO_NAO_E_DONO


class RemoverMembroProjetoService:
    def execute(self, idProjeto, idUsuario):
        usuario = u.buscarPorId(idUsuario)
        projeto = p.buscarPorId(idProjeto)

        if projeto is None and usuario is None:
            return {"erro": "Projeto e pessoa não encontrados"}, 404

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehDonoDoProjeto(projeto):
            return ERRO_NAO_E_DONO

        membro = MembroProjeto.query.filter_by(
            projeto_id=projeto.id,
            usuario_id=usuario.id
        ).first()

        # antes isso seguia pro remover com None e derrubava a rota
        if membro is None:
            return {"erro": "Essa pessoa não é membro do projeto"}, 404

        p.removerMembro(projeto, membro)

        return {"mensagem": f"{usuario.usuario} saiu da equipe"}, 200
