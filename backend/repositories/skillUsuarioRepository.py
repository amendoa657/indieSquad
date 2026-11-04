from database.database import db
from models.skillUsuario import SkillUsuario


class SkillUsuarioRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    # o vinculo entre a pessoa e a funcao, ou None quando ela nao tem
    @staticmethod
    def buscarVinculo(idSkill, idUsuario):
        return SkillUsuario.query.filter_by(
            skills_id=idSkill,
            usuario_id=idUsuario
        ).first()
