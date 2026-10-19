from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError

from config import Config
from database.database import db

# os models precisam ser importados aqui pro SQLAlchemy montar os relacionamentos
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
from controllers.estatisticaController import estatisticaBp
from controllers.avaliacaoController import avaliacaoBp
from controllers.ferramentaController import ferramentaBp


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
app.register_blueprint(estatisticaBp)
app.register_blueprint(avaliacaoBp)
app.register_blueprint(ferramentaBp)

db.init_app(app)


# sem isso uma rota errada devolve HTML e o front quebra ao ler como JSON
@app.errorhandler(404)
def naoEncontrado(erro):
    return jsonify({"erro": "Rota não encontrada"}), 404


@app.errorhandler(405)
def metodoErrado(erro):
    return jsonify({"erro": "Método não permitido nessa rota"}), 405


@app.errorhandler(IntegrityError)
def dadoRepetido(erro):
    db.session.rollback()
    return jsonify({"erro": "Esse dado já existe"}), 409


@app.errorhandler(Exception)
def erroInesperado(erro):
    db.session.rollback()

    # o erro vai pro log do servidor; o usuario recebe so a mensagem generica
    app.logger.exception(erro)

    return jsonify({"erro": "Erro interno no servidor"}), 500


if __name__ == "__main__":
    app.run(debug=Config.DEBUG)
