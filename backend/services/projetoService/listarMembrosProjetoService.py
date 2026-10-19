import models.projetos as p
import models.usuario as u


class ListarMembrosProjetoService:
    def execute(self, idProjeto):
        projeto = p.buscarPorId(idProjeto)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        # o criador aparece primeiro, com o cargo dele, e depois a equipe
        equipe = [dict(u.to_dict(projeto.criador), cargo="Criador")]

        for membro in p.getMembrosProjeto(projeto):
            equipe.append(dict(u.to_dict(membro.usuario), cargo=membro.cargo or "Membro"))

        return equipe, 200
