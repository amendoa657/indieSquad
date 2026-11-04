import models.ferramenta as f
from repositories.ferramentaRepository import FerramentaRepository


class ListarFerramentasService:
    def execute(self):
        return [f.to_dict(ferramenta) for ferramenta in FerramentaRepository.getFerramentas()], 200
