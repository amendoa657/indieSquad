from database.database import db
from models.marcoProjeto import MarcoProjeto


class MarcoProjetoRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(MarcoProjeto, id)

    @staticmethod
    def registrarMarco(titulo, ordem, idProjeto):
        marcoTable = MarcoProjeto(titulo=titulo, ordem=ordem, projeto_id=idProjeto)

        db.session.add(marcoTable)
        MarcoProjetoRepository.salvar()

        return marcoTable

    @staticmethod
    def removerMarco(marco):
        db.session.delete(marco)
        MarcoProjetoRepository.salvar()
