from database.database import db
from models.skills import Skills


class SkillRepository:

    @staticmethod
    def salvar():
        db.session.commit()

    @staticmethod
    def buscarPorId(id):
        return db.session.get(Skills, id)

    @staticmethod
    def getSkill(id):
        return db.session.get(Skills, id)

    @staticmethod
    def getSkills():
        return Skills.query.order_by(Skills.categoria, Skills.nome).all()

    @staticmethod
    def buscarPorNome(nome):
        return Skills.query.filter_by(nome=nome).first()

    @staticmethod
    def registrarSkill(nome, categoria="Outro"):
        skillsTable = Skills(nome=nome, categoria=categoria)

        db.session.add(skillsTable)
        SkillRepository.salvar()

        return skillsTable

    @staticmethod
    def deletarSkill(skill):
        db.session.delete(skill)
        SkillRepository.salvar()
