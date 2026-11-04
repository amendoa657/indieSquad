import models.usuario as u
from middlewares.autenticacao import gerarToken
from middlewares.validacao import campoFaltando, texto
from repositories.usuarioRepository import UsuarioRepository


class CadastrarUsuarioService:
    def execute(self, dados):
        faltando = campoFaltando(dados, ["nome", "handle", "email", "senha"])

        if faltando:
            return {"erro": f"O campo {faltando} é obrigatório"}, 400

        # o nome de exibicao vai pra coluna usuario, seguindo o padrao que ja existia
        nome = texto(dados["nome"], 60)
        handle = texto(dados["handle"], 30).lower()
        email = texto(dados["email"], 90).lower()
        senha = dados["senha"]
        objetivo = dados.get("objetivo", "ambos")

        if not u.handleValido(handle):
            return {"erro": "O apelido aceita só letra minúscula, número e underline, de 3 a 30 caracteres"}, 400

        if "@" not in email or "." not in email:
            return {"erro": "E-mail inválido"}, 400

        if not u.senhaForte(senha):
            return {"erro": f"A senha precisa de pelo menos {u.TAMANHO_MINIMO_SENHA} caracteres"}, 400

        if not u.objetivoValido(objetivo):
            return {"erro": "Objetivo inválido"}, 400

        if UsuarioRepository.buscarPorEmail(email):
            return {"erro": "E-mail já cadastrado"}, 409

        if UsuarioRepository.buscarPorHandle(handle):
            return {"erro": "Esse apelido já está em uso"}, 409

        usuario = UsuarioRepository.registrarUsuario(handle, nome, email, senha)

        usuario.objetivo = objetivo
        UsuarioRepository.salvar()

        return {
            "token": gerarToken(usuario),
            "usuario": u.to_dictCompleto(usuario)
        }, 201
