from database.database import db
from models.linkUsuario import LinkUsuario


class LinkUsuarioRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(LinkUsuario, id)

    @staticmethod
    def registrarLink(tipo, url, idUsuario):
        linkTable = LinkUsuario(tipo=tipo, url=url, usuario_id=idUsuario)

        db.session.add(linkTable)
        LinkUsuarioRepository.salvar()

        return linkTable

    @staticmethod
    def removerLink(link):
        db.session.delete(link)
        LinkUsuarioRepository.salvar()
