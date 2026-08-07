from controllers.projetoController import projetoBp
from controllers.vagaProjetoController import vagaBp
from flask import Flask
from flask_cors import CORS
from database.database import db


from models.usuario import Usuario
from models.projeto import Projeto
from models.skills import Skills
from models.skillUsuario import SkillUsuario

from controllers.usuarioController import usuarioBp
from controllers.authController import authBp
from controllers.projetoController import projetoBp
from controllers.skillController import skillBp
from controllers.vagaProjetoController import vagaBp


app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5001", "http://localhost:5001"])

app.register_blueprint(usuarioBp)
app.register_blueprint(authBp)
app.register_blueprint(projetoBp)
app.register_blueprint(skillBp)
app.register_blueprint(vagaBp)



app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root@localhost/indieSquad"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)