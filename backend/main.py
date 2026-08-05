from controllers.projetoController import projetoBp
from flask import Flask
from database.database import db

from models.usuario import Usuario
from models.projeto import Projeto

from controllers.usuarioController import usuarioBp
from controllers.authController import authBp
from controllers.projetoController import projetoBp


app = Flask(__name__)
app.register_blueprint(usuarioBp)
app.register_blueprint(authBp)
app.register_blueprint(projetoBp)



app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root@localhost/indieSquad"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)