from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

from config import Config
from database.database import db

# Todos os models precisam ser importados aqui pro SQLAlchemy conseguir montar
# os relacionamentos entre eles.
from models.usuario import Usuario
from models.projetos import Projeto
from models.skills import Skills
from models.skillUsuario import SkillUsuario
from models.ferramenta import Ferramenta
from models.ferramentaUsuario import FerramentaUsuario
from models.linkUsuario import LinkUsuario
from models.membroProjeto import MembroProjeto
from models.marcoProjeto import MarcoProjeto
from models.vagaProjeto import VagaProjeto
from models.candidaturaUsuario import CandidaturaUsuario
from models.avaliacao import Avaliacao

from controllers.usuarioController import usuarioBp
from controllers.authController import authBp
from controllers.projetoController import projetoBp
from controllers.skillController import skillBp
from controllers.vagaProjetoController import vagaBp
from controllers.candidaturaController import candidaturaBp
from controllers.dashboardController import dashboardBp
from controllers.buscaController import buscaBp


app = Flask(__name__)
app.config.from_object(Config)

CORS(app, origins=Config.ORIGENS_PERMITIDAS)

app.register_blueprint(usuarioBp)
app.register_blueprint(authBp)
app.register_blueprint(projetoBp)
app.register_blueprint(skillBp)
app.register_blueprint(vagaBp)
app.register_blueprint(candidaturaBp)
app.register_blueprint(dashboardBp)
app.register_blueprint(buscaBp)

db.init_app(app)


# Sem esses tratadores, uma rota errada devolvia uma pagina HTML de erro e o
# front quebrava tentando ler aquilo como JSON.
@app.errorhandler(404)
def naoEncontrado(erro):
    return jsonify({"erro": "Rota nao encontrada"}), 404


@app.errorhandler(405)
def metodoErrado(erro):
    return jsonify({"erro": "Metodo nao permitido nessa rota"}), 405


@app.errorhandler(IntegrityError)
def dadoRepetido(erro):
    db.session.rollback()
    return jsonify({"erro": "Esse dado ja existe"}), 409


@app.errorhandler(Exception)
def erroInesperado(erro):
    db.session.rollback()

    # O erro vai pro log do servidor; o usuario recebe so a mensagem generica.
    # Devolver o texto do erro pra tela entrega detalhe do banco pra quem
    # estiver olhando.
    app.logger.exception(erro)

    return jsonify({"erro": "Erro interno no servidor"}), 500


if __name__ == "__main__":
    app.run(debug=Config.DEBUG)
