from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from database.database import db
from controllers.usuarioController import usuarioBp
from controllers.authController import authBp
from models.usuario import buscarPorId


app = Flask(__name__)
app.register_blueprint(usuarioBp)
app.register_blueprint(authBp)



app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root@localhost/indieSquad"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)