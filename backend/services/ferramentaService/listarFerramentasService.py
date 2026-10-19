import models.ferramenta as f


class ListarFerramentasService:
    def execute(self):
        return [f.to_dict(ferramenta) for ferramenta in f.getFerramentas()], 200
