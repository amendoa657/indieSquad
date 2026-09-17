import models.usuario as u
import models.skills as s
from models.skillUsuario import SkillUsuario


class CadastrarUsuarioService:
    def execute(self, dados):
        nome = dados["nome"]
        email = dados["email"]
        senha = dados["senha"]
        especialidade = dados.get("especialidade")

        if u.buscarPorEmail(email):
            return {"erro": "E-mail ja cadastrado"}, 409

        # "nome" (nome completo, vindo do front) vai pra coluna "usuario",
        # seguindo o mesmo padrao que ja existe nos dados atuais da tabela.
        usuario = u.registrarUsuario(nome, email, senha)

        if especialidade:
            skill = s.Skills.query.filter_by(nome=especialidade).first()

            if not skill:
                s.registrarSkill(especialidade)
                skill = s.Skills.query.filter_by(nome=especialidade).first()

            vinculo = SkillUsuario(
                skills=skill,
                usuario=usuario,
                nivel=1
            )

            u.adicionarSkill(usuario, vinculo)

        token = f"usuario-{usuario.id}"

        return {"token": token}, 201
