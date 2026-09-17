import models.projetos as p
import models.usuario as u


class ListarMembrosProjetoService:
    def execute(self, idProjeto):
        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto nao encontrado"}, 404

        return [u.to_dict(membro.usuario) for membro in p.getMembrosProjeto(projeto)]
