import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # chave que assina o token do login
    SECRET_KEY = os.getenv("SECRET_KEY", "chave-de-desenvolvimento-nao-usar-em-producao")

    # quantas horas o token continua valido depois do login
    HORAS_EXPIRACAO_TOKEN = int(os.getenv("HORAS_EXPIRACAO_TOKEN", "12"))

    # em producao tem que ser 0: o debug abre um console que roda codigo no servidor
    DEBUG = os.getenv("DEBUG", "1") == "1"

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "mysql+pymysql://root@localhost/indieSquad?charset=utf8mb4")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # enderecos do front que tem permissao pra chamar essa API
    ORIGENS_PERMITIDAS = os.getenv(
        "ORIGENS_PERMITIDAS",
        "http://127.0.0.1:5500,http://localhost:5500"
    ).split(",")
