from database.database import db

class SkillUsuario(db.Model):
    __tablename__ = "skillUsuario"

    skills_id = db.Column(db.Integer, db.ForeignKey("skills.id"), primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuario.id"), primary_key=True)
    nivel = db.Column(db.Integer)

    skills = db.relationship("Skills", back_populates="usuarios")
    usuario = db.relationship("Usuario", back_populates="skills")