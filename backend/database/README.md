# Os scripts do banco

São dois, e rodam **nesta ordem**:

| Ordem | Arquivo | O que faz |
| --- | --- | --- |
| 1 | `scriptCreateIndieSquadV2.sql` | Cria o banco `indieSquad` inteiro, com todas as tabelas |
| 2 | `seedIndieSquad.sql` | Preenche o catálogo de funções e ferramentas — **o sistema não funciona sem ele** — e cria usuários e projetos de exemplo |

Os dois são autossuficientes: o primeiro faz o `CREATE SCHEMA` e o segundo faz o `use indieSquad`. Não precisa selecionar schema antes de executar.

A senha de todos os usuários de exemplo é `indiesquad123`.

## No MySQL Workbench

`File > Open SQL Script...`, escolhe o arquivo e executa com o raio ⚡ (ou `Ctrl+Shift+Enter`, que roda o script inteiro). Repete pro segundo.

Se o `indieSquad` não aparecer na lista de schemas depois, clica no refresh ao lado de "SCHEMAS", no painel da esquerda — ele não atualiza sozinho.

## Pra recriar do zero

Rodar os dois de novo. O primeiro apaga e refaz o banco, então **todos os dados que estiverem lá se perdem**.

> Se faltar alguma coisa no banco, o `py main.py` avisa no terminal o que está errado e qual script resolve.
