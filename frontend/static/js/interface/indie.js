// o JavaScript visual da IndieSquad, carregado como modulo em toda tela:
//   - liga a Mosaic UI (teclas, pixels do fundo, onda entre as telas)
//   - registra a pixel art (sprites, cartuchos, numeros, medidores)
//   - desenha os simbolos de game dev que a Mosaic nao tem
//   - troca o tema numa onda de pixels saindo do botao
//
// A logica das telas continua nos scripts de cada uma (dashboard/dashboard.js, perfil/perfil.js...).

import { registrarSimbolo, revelar } from "../../mosaic-ui/mosaic.js";
import "./pixelArte/pixelArte.js";

const G = (texto) => texto.trim().split(/\s+/);

// cada simbolo e uma grade 9x9: # e pixel aceso
const SIMBOLOS = {
    controle: G(`
        .........
        .........
        .#######.
        ##.####.#
        #...##.##
        ##.######
        ###...###
        .##...##.
        .........`),
    pincel: G(`
        ......##.
        .....####
        ....####.
        ...####..
        ..####...
        .##.##...
        ##.......
        ##.......
        .........`),
    nota: G(`
        ...######
        ...######
        ...#....#
        ...#....#
        ...#....#
        .###..###
        ####.####
        .##...##.
        .........`),
    esquadro: G(`
        #........
        ##.......
        #.#......
        #..#.....
        #.#.#....
        #.##.#...
        #.....#..
        ########.
        .........`),
    claquete: G(`
        .........
        ##.##.##.
        .##.##.##
        #########
        #.......#
        #.......#
        #.......#
        #########
        .........`),
    codigo: G(`
        .........
        .....#...
        ..#..##..
        .#..#..#.
        #...#...#
        .#..#..#.
        ..##..#..
        ...#.....
        .........`),
    bandeira: G(`
        .#.......
        .#######.
        .########
        .#######.
        .#.......
        .#.......
        .#.......
        .#.......
        ###......`),
    coroa: G(`
        .........
        .........
        #...#...#
        ##.###.##
        #########
        #########
        .#######.
        .........
        .........`),
    sair: G(`
        .........
        ####.....
        #........
        #.....#..
        #..######
        #.....#..
        #........
        ####.....
        .........`),
    escudo: G(`
        .#######.
        #########
        ###.#####
        ###.#####
        #########
        .#######.
        ..#####..
        ...###...
        ....#....`),
    raio: G(`
        .....##..
        ....##...
        ...##....
        ..######.
        .....##..
        ....##...
        ...##....
        ..##.....
        .........`),
};

for (const [nome, grade] of Object.entries(SIMBOLOS)) {
    registrarSimbolo(nome, grade.map((linha) => linha.padEnd(9, ".").slice(0, 9)));
}


// troca de tema em onda: a tela cobre em pixels, troca as cores e revela a
// partir do botao que foi clicado
const trocarSemOnda = window.trocarTema;

window.trocarTema = function (evento) {
    const botao = evento?.currentTarget || document.activeElement;
    const caixa = botao?.getBoundingClientRect?.();
    const x = caixa ? caixa.left + caixa.width / 2 : innerWidth - 40;
    const y = caixa ? caixa.top + caixa.height / 2 : 30;

    const trocar = () => {
        trocarSemOnda();
        document.dispatchEvent(new CustomEvent("mo-tema", { bubbles: true }));
    };

    revelar(document.body, { x, y, trocar });
};
