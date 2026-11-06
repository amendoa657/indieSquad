// a abertura mostra quem ja esta no sistema, como a tela de escolher a party
// de um jogo: um cursor de menu passa de pessoa em pessoa

const LIMITE_ELENCO = 4;
const ESPERA_CURSOR = 1600;

function primeiroESobrenome(nome) {
  const partes = nome.trim().split(/\s+/);

  if (partes.length === 1) return partes[0];

  return `${partes[0]} ${partes[partes.length - 1]}`;
}

async function carregarElenco() {
  const pessoas = await pedir("/busca/profissionais");
  if (!pessoas) return;

  const comFuncao = pessoas.filter(funcaoPrincipal).slice(0, LIMITE_ELENCO);

  listar(
    "elencoLista",
    comFuncao,
    function (pessoa) {
      const principal = funcaoPrincipal(pessoa);

      return `
            <li class="elencoItem ${classe(principal.categoria)}" tabindex="-1">
                ${sprite(pessoa, 36)}
                <span class="elencoNome">${escapar(primeiroESobrenome(pessoa.nome))}</span>
                <span class="elencoFuncao">${escapar(principal.nome)}</span>
                <is-nivel valor="${principal.nivel}"></is-nivel>
            </li>            
        `;
    },
    "Ninguém por aqui ainda. Seja o primeiro.",
  );

  ligarCursor();
}

// o cursor anda sozinho; o mouse e as setas tomam o controle
function ligarCursor() {
  const itens = [...document.querySelectorAll(".elencoItem")];
  if (itens.length === 0) return;

  let atual = 0;
  let relogio = null;

  function escolher(indice) {
    itens[atual].classList.remove("escolhido");
    atual = (indice + itens.length) % itens.length;
    itens[atual].classList.add("escolhido");
  }

  function andar() {
    clearInterval(relogio);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    relogio = setInterval(() => escolher(atual + 1), ESPERA_CURSOR);
  }

  itens.forEach(function (item, indice) {
    item.onmouseenter = function () {
      escolher(indice);
      clearInterval(relogio);
    };

    item.onclick = () => irPara("cadastro.html");
  });

  document.querySelector(".elencoLista").onmouseleave = andar;

  document.addEventListener("keydown", function (evento) {
    if (evento.target.closest("input, textarea")) return;

    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      const caixa = document.querySelector(".selecao").getBoundingClientRect();

      // so rouba as setas quando a party esta na tela
      if (caixa.bottom < 0 || caixa.top > innerHeight) return;

      evento.preventDefault();
      escolher(atual + (evento.key === "ArrowDown" ? 1 : -1));
      andar();
    }
  });

  escolher(0);
  andar();
}

async function carregarEstatisticas() {
  const dados = await pedir("/estatisticas");
  if (!dados) return;

  escrever(
    "elencoRodape",
    `${plural(dados.profissionais, "jogador", "jogadores")} · ` +
      `${plural(dados.projetos, "projeto", "projetos")} · ` +
      `${plural(dados.avaliacoes, "avaliação", "avaliações")}`,
  );
}

// as categorias vem do catalogo do banco e levam pra busca ja filtrada
async function carregarFuncoes() {
  const skills = await catalogo();
  if (skills.length === 0) return;

  const porCategoria = new Map();

  skills.forEach(function (skill) {
    if (!porCategoria.has(skill.categoria))
      porCategoria.set(skill.categoria, []);
    porCategoria.get(skill.categoria).push(skill.nome);
  });

  const categorias = [...porCategoria.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );

  listar(
    "funcoes",
    categorias,
    function ([categoria, nomes]) {
      return `
            <li class="${classe(categoria)}">
                <a class="classeColuna" href="busca.html?categoria=${encodeURIComponent(categoria)}">
                    <mo-simbolo nome="${simboloDaClasse(categoria)}" tamanho="36"></mo-simbolo>
                    <span class="classeTotal">${plural(nomes.length, "função", "funções")}</span>
                    <span class="classeNome">${escapar(categoria)}</span>
                    <span class="classeFuncoes">${nomes.map(escapar).join("<br>")}</span>
                    <span class="classeVer">ver quem está livre →</span>
                </a>
            </li>
        `;
    },
    "O catálogo de funções ainda não foi carregado.",
  );
}

// no fim da pagina, uma fileira de bichinhos esperando a equipe ser montada
function desenharFecho() {
  const classes = ["arte", "audio", "design", "producao", "programacao"];
  let html = "";

  for (let i = 0; i < 9; i++) {
    html += `<is-sprite class="classe-${classes[i % classes.length]}" semente="jogador-${i * 7 + 3}" style="--is-sprite:54px; --i:${i}"></is-sprite>`;
  }

  escrever("fechoSprites", html);
}

carregarElenco();
carregarEstatisticas();
carregarFuncoes();
desenharFecho();
