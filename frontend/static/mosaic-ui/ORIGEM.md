# De onde veio esta pasta

A `mosaic-ui` é a biblioteca de interface da **Mosaic Store**
(https://github.com/amendoa657/mosaicStore). Ela foi copiada pra cá sem
alteração, só sem a vitrine (`index.html` e `vitrine/`), que não é usada aqui.

A identidade da IndieSquad é aplicada por fora:

- `static/style/tokens.css` define as cores (as variáveis `--cor*` que a
  Mosaic lê) nos temas escuro e claro, e as cores das classes.
- `static/js/indie.js` liga a biblioteca e registra os símbolos de game dev.
- `static/js/pixelArte.js` tem as peças que são só da IndieSquad: sprites,
  cartuchos, números em pixel, medidores e níveis.

Manter esta pasta intocada é de propósito. Quando a biblioteca mudar lá, dá
pra trazer a versão nova por cima sem perder nada daqui.

A Mosaic Store é distribuída sob **GPL-3.0**. Como os autores da biblioteca
são integrantes deste trabalho, o uso aqui está acertado entre eles; se este
repositório for publicado, vale incluir o aviso de licença correspondente.

As fontes (Space Grotesk e JetBrains Mono) são SIL OFL 1.1, com as licenças
em `fontes/LICENSE-*.txt`.
