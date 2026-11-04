from database.database import db
from models.vagaProjeto import VagaProjeto


class VagaProjetoRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(VagaProjeto, id)

    @staticmethod
    def mostrarVagaProjeto(id):
        return db.session.get(VagaProjeto, id)

    @staticmethod
    def mostrarVagaProjetos():
        return VagaProjeto.query.all()

    @staticmethod
    def listarPorProjeto(idProjeto):
        return VagaProjeto.query.filter_by(projeto_id=idProjeto).order_by(VagaProjeto.dataCriacao).all()

    @staticmethod
    def registrarVagaProjeto(titulo, descricao, status, idProjeto, idSkill, nivelMinimo=None):
        VagaProjetoTable = VagaProjeto(
            titulo=titulo,
            descricao=descricao,
            status=status,
            nivelMinimo=nivelMinimo,
            projeto_id=idProjeto,
            skills_id=idSkill
        )

        db.session.add(VagaProjetoTable)
        VagaProjetoRepository.salvar()

        return VagaProjetoTable

    @staticmethod
    def removerVagaProjeto(vagaProjeto):
        db.session.delete(vagaProjeto)
        VagaProjetoRepository.salvar()

        return f"Vaga {vagaProjeto.titulo} removido com sucesso!"
