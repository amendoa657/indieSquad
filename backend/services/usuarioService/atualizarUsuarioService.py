import models.usuario as u
from middlewares.validacao import texto, inteiroNoIntervalo
from middlewares.autenticacao import ehOProprio, ERRO_NAO_E_VOCE


class AtualizarUsuarioService:
    def execute(self, id, dados):
        usuario = u.buscarPorId(id)

        if usuario is None:
            return {"erro": "Pessoa não encontrada"}, 404

        if not ehOProprio(id):
            return ERRO_NAO_E_VOCE

        if dados is None:
            return {"erro": "Nenhum dado foi enviado"}, 400

        if "usuario" in dados:
            nome = texto(dados["usuario"], 60)

            if not nome:
                return {"erro": "O nome não pode ficar vazio"}, 400

            usuario.usuario = nome

        if "handle" in dados:
            handle = texto(dados["handle"], 30).lower()

            if not u.handleValido(handle):
                return {"erro": "O apelido aceita só letra minúscula, número e underline, de 3 a 30 caracteres"}, 400

            emUso = u.buscarPorHandle(handle)

            if emUso and emUso.id != usuario.id:
                return {"erro": "Esse apelido já está em uso"}, 409

            usuario.handle = handle

        if "email" in dados:
            email = texto(dados["email"], 90).lower()

            if "@" not in email or "." not in email:
                return {"erro": "E-mail inválido"}, 400

            emUso = u.buscarPorEmail(email)

            if emUso and emUso.id != usuario.id:
                return {"erro": "E-mail já cadastrado"}, 409

            usuario.email = email

        if "bio" in dados:
            usuario.bio = texto(dados["bio"], 2000)

        if "objetivo" in dados:
            if not u.objetivoValido(dados["objetivo"]):
                return {"erro": "Objetivo inválido"}, 400

            usuario.objetivo = dados["objetivo"]

        if "disponibilidadeHoras" in dados:
            if dados["disponibilidadeHoras"] is None:
                usuario.disponibilidadeHoras = None
            else:
                horas = inteiroNoIntervalo(dados["disponibilidadeHoras"], 1, 80)

                if horas is None:
                    return {"erro": "A disponibilidade deve ser de 1 a 80 horas por semana"}, 400

                usuario.disponibilidadeHoras = horas

        if "aceitaPortfolio" in dados:
            usuario.aceitaPortfolio = bool(dados["aceitaPortfolio"])

        if "aceitaRevenueShare" in dados:
            usuario.aceitaRevenueShare = bool(dados["aceitaRevenueShare"])

        if "aceitaRemunerado" in dados:
            usuario.aceitaRemunerado = bool(dados["aceitaRemunerado"])

        # vazio volta pra cor automatica, a da funcao principal
        if "corPerfil" in dados:
            cor = dados["corPerfil"] or None

            if cor is not None and not u.corPerfilValida(cor):
                return {"erro": "Essa cor não está na paleta"}, 400

            usuario.corPerfil = cor

        if "fotoDePerfil" in dados:
            usuario.fotoDePerfil = texto(dados["fotoDePerfil"], 255)

        # a senha tem rota propria, que exige a senha atual antes de trocar

        u.salvar()

        return u.to_dictCompleto(usuario), 200
