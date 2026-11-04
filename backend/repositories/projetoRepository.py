from database.database import db
from sqlalchemy.sql import func

from models.projetos import Projeto


class ProjetoRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(Projeto, id)

    @staticmethod
    def mostrarProjeto(id):
        return db.session.get(Projeto, id)

    @staticmethod
    def mostrarProjetos():
        return Projeto.query.order_by(Projeto.dataCriacao.desc()).all()

    @staticmethod
    def registrarProjeto(nome, status, usuario_id, descricao, logoProjeto):
        ProjetoTable = Projeto(
            nome=nome,
            status=status,
            criador_id=usuario_id,
            descricao=descricao,
            logoProjeto=logoProjeto
        )

        db.session.add(ProjetoTable)
        ProjetoRepository.salvar()

        return ProjetoTable

    @staticmethod
    def removerProjeto(projeto):
        db.session.delete(projeto)
        ProjetoRepository.salvar()

        return f"Projeto {projeto.nome} removido com sucesso!"

    # grava o projeto como concluido; a regra de fechar as vagas fica no Service
    @staticmethod
    def marcarConcluido(projeto):
        projeto.status = "concluido"
        projeto.dataConclusao = func.now()

        ProjetoRepository.salvar()

        return projeto

    @staticmethod
    def adicionarMembro(projeto, membro):
        projeto.membros.append(membro)
        ProjetoRepository.salvar()

        return f"O membro {membro.usuario.usuario} foi adicionado com sucesso!"

    @staticmethod
    def removerMembro(projeto, membro):
        projeto.membros.remove(membro)
        ProjetoRepository.salvar()

        return f"O membro {membro.usuario.usuario} foi removido com sucesso!"

    # filtro da busca publica resolvido em SQL, nao em Python
    @staticmethod
    def buscarProjetosPublicos(termo=None, genero=None, engine=None,
                               tipoParceria=None, status=None):
        consulta = Projeto.query

        if termo:
            consulta = consulta.filter(Projeto.nome.ilike(f"%{termo}%"))

        if genero and genero != "Todos":
            consulta = consulta.filter(Projeto.genero == genero)

        if engine and engine != "Todos":
            consulta = consulta.filter(Projeto.engine == engine)

        if tipoParceria and tipoParceria != "Todos":
            consulta = consulta.filter(Projeto.tipoParceria == tipoParceria)

        if status and status != "Todos":
            consulta = consulta.filter(Projeto.status == status)

        return consulta.order_by(Projeto.dataCriacao.desc()).all()
