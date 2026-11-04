from database.database import db
from models.ferramenta import Ferramenta


class FerramentaRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(Ferramenta, id)

    @staticmethod
    def getFerramentas():
        return Ferramenta.query.order_by(Ferramenta.categoria, Ferramenta.nome).all()

    @staticmethod
    def buscarPorNome(nome):
        return Ferramenta.query.filter_by(nome=nome).first()

    @staticmethod
    def registrarFerramenta(nome, categoria="Outro"):
        ferramentaTable = Ferramenta(nome=nome, categoria=categoria)

        db.session.add(ferramentaTable)
        FerramentaRepository.salvar()

        return ferramentaTable

    @staticmethod
    def deletarFerramenta(ferramenta):
        db.session.delete(ferramenta)
        FerramentaRepository.salvar()
