// pixel art da IndieSquad: tudo que e desenhado quadradinho por quadradinho
//
//   <is-sprite semente="laura" classe="arte"></is-sprite>   bonequinho da pessoa, sempre o mesmo pro mesmo apelido
//   <is-cartucho nome="Hollow Signal"></is-cartucho>         a capa do projeto, com a inicial em fonte de pixel
//   <is-numero>42</is-numero>                                numero em fonte de pixel que acende bloco por bloco
//   <is-medidor valor="60" segmentos="10"></is-medidor>      barra em segmentos, tipo barra de vida
//   <is-nivel valor="3"></is-nivel>                          nivel da funcao, de 1 a 4
//
// O texto de dentro do <is-numero> e o valor: quando o JS da tela faz
// escrever("total", 12), o numero se redesenha sozinho. As cores vem do CSS
// (currentColor e as variaveis --is-*), entao seguem o tema claro e o escuro.

import "./marca.js";
import "./numero.js";
import "./medidor.js";
import "../../perfil/fotoPerfil/sprite.js";
import "../../projeto/capa/cartucho.js";
import "../../funcoes/nivel.js";
