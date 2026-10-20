# Qual arquivo rodar

Esta pasta tem scripts de versões diferentes do banco. **Só três são usados hoje.**

## Instalação nova

Rodar nesta ordem:

| Ordem | Arquivo | O que faz |
| --- | --- | --- |
| 1 | `scriptCreateIndieSquadV2.sql` | Cria o banco `indieSquad` inteiro, já na versão atual |
| 2 | `seedIndieSquad.sql` | Preenche o catálogo de funções e ferramentas — **o sistema não funciona sem ele** — e cria usuários e projetos de exemplo |

A senha de todos os usuários de exemplo é `indiesquad123`.

## Quem já tem o banco da versão antiga

| Arquivo | O que faz |
| --- | --- |
| `scriptAtualizacaoV2.sql` | Atualiza o banco da V1 pra V2 **preservando os dados que já estão lá** |

Roda ele no lugar do `scriptCreateIndieSquadV2.sql`, e depois o `seedIndieSquad.sql`.

## Os antigos, que ficaram só como histórico

**Não rode nenhum destes.** Eles criam o banco na estrutura antiga, sem as tabelas e colunas que o sistema usa hoje, e a API sobe mas quebra com "Erro interno no servidor" na primeira tela.

| Arquivo | Por que não |
| --- | --- |
| `indieSquadNewDatabase.sql` | O "New" no nome é da época dele. Hoje é o **mais antigo** dos dois |
| `scriptCreateIndieSquadDB.sql` | Primeira versão do banco |
| `teste.sql` | Rascunho de consultas |

> Se rodar um deles por engano, o `py main.py` avisa no terminal qual é o problema e qual script roda pra consertar.
