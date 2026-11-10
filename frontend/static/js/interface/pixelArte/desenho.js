// a base da pixel art: monta um <svg> quadradinho por quadradinho

const SVG = "http://www.w3.org/2000/svg";

const semMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;


// monta um <svg> a partir de uma lista de quadradinhos [coluna, linha]
function desenhar(colunas, linhas, quadrados, extra = "") {
    const svg = document.createElementNS(SVG, "svg");

    svg.setAttribute("viewBox", `0 0 ${colunas} ${linhas}`);
    // o viewbox faz cada quadradinho valer 1 e o svg estica pro tamanho que o css mandar
    // o crispedges deixa a borda seca sem borrar que e o que faz parecer pixel
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("aria-hidden", "true");

    let html = extra;

    for (const [x, y, classe] of quadrados) {
        html += `<rect x="${x}" y="${y}" width="1" height="1"${classe ? ` class="${classe}"` : ""}/>`;
    }

    svg.innerHTML = html;
    return svg;
}


export { SVG, semMovimento, desenhar };
