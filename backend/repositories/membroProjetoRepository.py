from database.database import db
from models.membroProjeto import MembroProjeto


class MembroProjetoRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    # o vinculo da pessoa com o projeto, ou None quando ela nao e da equipe
    @staticmethod
    def buscarVinculo(idProjeto, idUsuario):
        return MembroProjeto.query.filter_by(
            projeto_id=idProjeto,
            usuario_id=idUsuario
        ).first()
