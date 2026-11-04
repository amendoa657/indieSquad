from sqlalchemy import or_
from werkzeug.security import generate_password_hash

from database.database import db
from models.usuario import Usuario
from models.skills import Skills
from models.skillUsuario import SkillUsuario


# Camada de acesso a dados do usuario: aqui ficam as consultas e a gravacao.
# Quem chama e o Service; o Model so descreve a entidade.
class UsuarioRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(Usuario, id)

    @staticmethod
    def mostrarUsuario(id):
        return db.session.get(Usuario, id)

    @staticmethod
    def mostrarUsuarios():
        return Usuario.query.all()

    @staticmethod
    def buscarPorEmail(email):
        return Usuario.query.filter_by(email=email).first()

    @staticmethod
    def buscarPorHandle(handle):
        return Usuario.query.filter_by(handle=handle).first()

    # a senha chega em texto e e gravada como hash
    @staticmethod
    def registrarUsuario(handle, usuario, email, senha):
        usuarioTable = Usuario(
            handle=handle,
            usuario=usuario,
            email=email,
            senha=generate_password_hash(senha)
        )

        db.session.add(usuarioTable)
        UsuarioRepository.salvar()

        return usuarioTable

    @staticmethod
    def definirSenha(usuario, senha):
        usuario.senha = generate_password_hash(senha)
        UsuarioRepository.salvar()

    @staticmethod
    def deletarUsuario(usuario):
        db.session.delete(usuario)
        UsuarioRepository.salvar()

    @staticmethod
    def adicionarSkill(usuario, skill):
        usuario.skills.append(skill)
        UsuarioRepository.salvar()

    @staticmethod
    def removerSkill(usuario, skill):
        usuario.skills.remove(skill)
        UsuarioRepository.salvar()

    @staticmethod
    def adicionarFerramenta(usuario, ferramenta):
        usuario.ferramentas.append(ferramenta)
        UsuarioRepository.salvar()

    @staticmethod
    def removerFerramenta(usuario, ferramenta):
        usuario.ferramentas.remove(ferramenta)
        UsuarioRepository.salvar()

    # A busca de profissionais e resolvida no banco, com filtro em SQL.
    # Antes isso era feito carregando todo mundo e filtrando em Python.
    @staticmethod
    def buscarProfissionais(skillNome=None, termo=None, objetivo=None,
                            tipoColaboracao=None, horasMinimas=None, categoria=None):
        consulta = Usuario.query

        if termo:
            procurado = f"%{termo}%"
            consulta = consulta.filter(
                or_(Usuario.usuario.ilike(procurado), Usuario.handle.ilike(procurado))
            )

        # subconsulta EXISTS: a pessoa precisa ter a funcao pedida
        if skillNome and skillNome != "Todos":
            consulta = consulta.filter(
                Usuario.skills.any(SkillUsuario.skills.has(Skills.nome == skillNome))
            )

        # idem para a area da funcao, independente da anterior
        if categoria and categoria != "Todos":
            consulta = consulta.filter(
                Usuario.skills.any(SkillUsuario.skills.has(Skills.categoria == categoria))
            )

        # quem marcou "ambos" aparece nas duas intencoes
        if objetivo and objetivo != "Todos":
            consulta = consulta.filter(
                or_(Usuario.objetivo == objetivo, Usuario.objetivo == "ambos")
            )

        if tipoColaboracao == "portfolio":
            consulta = consulta.filter(Usuario.aceitaPortfolio.is_(True))
        elif tipoColaboracao == "revenueShare":
            consulta = consulta.filter(Usuario.aceitaRevenueShare.is_(True))
        elif tipoColaboracao == "remunerado":
            consulta = consulta.filter(Usuario.aceitaRemunerado.is_(True))

        if horasMinimas:
            consulta = consulta.filter(
                Usuario.disponibilidadeHoras.isnot(None),
                Usuario.disponibilidadeHoras >= int(horasMinimas)
            )

        return consulta.all()
