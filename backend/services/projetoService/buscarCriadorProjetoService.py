import models.usuario as u
from repositories.projetoRepository import ProjetoRepository


class BuscarCriadorProjetoService:
    def execute(self, id):
        projeto = ProjetoRepository.buscarPorId(id)

        if projeto is None:
            return {"erro": "Projeto não encontrado"}, 404

        return u.to_dict(projeto.criador), 200
