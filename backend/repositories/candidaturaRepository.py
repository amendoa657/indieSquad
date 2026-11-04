from database.database import db
from models.candidaturaUsuario import CandidaturaUsuario


class CandidaturaRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(CandidaturaUsuario, id)

    @staticmethod
    def mostrarCandidatura(id):
        return db.session.get(CandidaturaUsuario, id)

    @staticmethod
    def mostrarCandidaturas():
        return CandidaturaUsuario.query.all()

    @staticmethod
    def listarPorUsuario(idUsuario):
        return (CandidaturaUsuario.query
                .filter_by(usuario_id=idUsuario)
                .order_by(CandidaturaUsuario.dataCriacao.desc())
                .all())

    @staticmethod
    def listarPorVaga(idVaga):
        return CandidaturaUsuario.query.filter_by(vagaProjeto_id=idVaga).all()

    @staticmethod
    def buscarDoUsuarioNaVaga(idUsuario, idVaga):
        return CandidaturaUsuario.query.filter_by(
            usuario_id=idUsuario,
            vagaProjeto_id=idVaga
        ).first()

    # o status nunca vem do front: toda candidatura nasce pendente
    @staticmethod
    def registrarCandidatura(mensagem, idVagaProjeto, idUsuario):
        CandidaturaTable = CandidaturaUsuario(
            mensagem=mensagem,
            status="pendente",
            vagaProjeto_id=idVagaProjeto,
            usuario_id=idUsuario
        )

        db.session.add(CandidaturaTable)
        CandidaturaRepository.salvar()

        return CandidaturaTable

    @staticmethod
    def removerCandidatura(candidatura):
        db.session.delete(candidatura)
        CandidaturaRepository.salvar()
