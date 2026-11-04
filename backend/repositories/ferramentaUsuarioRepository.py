from database.database import db
from models.ferramentaUsuario import FerramentaUsuario


class FerramentaUsuarioRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    # o vinculo entre a pessoa e a ferramenta, ou None quando ela nao tem
    @staticmethod
    def buscarVinculo(idFerramenta, idUsuario):
        return FerramentaUsuario.query.filter_by(
            ferramenta_id=idFerramenta,
            usuario_id=idUsuario
        ).first()
