## IndieSquad


## Integrantes do grupo:
- Thales Alves Gomes
- Italo Cunha Cisar Pinheiro
- Estêvão Neves Coimbra Nery
- Laura Coelho Pacheco
- Lucas Augusto de Paula Rocha
- Heitor Castro Felipe


## Stack utilizada no projeto:

### Frontend:
HTML/CSS e JS

### Backend:
Flask

### Banco de dados:
MySql


## Breve descrição do sistema:
IndieSquad é uma plataforma web voltada para desenvolvedores independentes de jogos e colaboradores que desejam participar de projetos criativos. O sistema facilita a formação de equipes, permitindo que criadores publiquem projetos, definam as habilidades necessárias e encontrem colaboradores compatíveis com suas necessidades.

A plataforma oferece recursos para cadastro de usuários, gerenciamento de perfis e portfólios, publicação de projetos e vagas, candidatura de colaboradores, avaliações entre participantes e acompanhamento da reputação dos usuários. Além disso, busca aumentar a confiabilidade das equipes por meio de sistemas de avaliação, histórico de participação e mecanismos de compromisso entre os membros.

O principal objetivo do IndieSquad é reduzir as dificuldades encontradas por desenvolvedores independentes na busca por colaboradores qualificados e comprometidos, tornando o processo de criação de jogos mais organizado, seguro e eficiente.


## Como rodar o projeto

O frontend e o backend são separados, então são dois servidores rodando ao mesmo tempo.

### 1. Banco de dados

Precisa do MySQL instalado (no Windows, o **MySQL Installer** já traz o Server e o Workbench juntos).

Pelo **Workbench**: abrir `File > Open SQL Script`, escolher o arquivo e clicar no raio pra executar. Nessa ordem:

1. `backend/database/scriptCreateIndieSquadV2.sql` — cria o banco `indieSquad` inteiro
2. `backend/database/seedIndieSquad.sql` — preenche o catálogo de funções e ferramentas (o sistema precisa dele pra funcionar) e cria usuários e projetos de exemplo

Pelo **terminal**, de dentro da pasta do projeto:

```powershell
mysql -u root -p < backend\database\scriptCreateIndieSquadV2.sql
mysql -u root -p < backend\database\seedIndieSquad.sql
```

> Se o `mysql` não for reconhecido no terminal, ele não está no PATH. Ou usa o Workbench, ou roda pelo caminho completo (normalmente `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`).

> Quem já tem o banco da versão antiga roda `backend/database/scriptAtualizacaoV2.sql` em vez do primeiro: ele atualiza o banco preservando os dados que já estão lá.

A senha de todos os usuários de exemplo é `indiesquad123`.

### 2. Backend

Precisa do Python 3.12 ou mais novo. No Windows, instalar pelo [python.org](https://www.python.org/downloads/) marcando **"Add python.exe to PATH"** na primeira tela do instalador.

```powershell
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

> Se o PowerShell reclamar que *"execução de scripts foi desabilitada neste sistema"*, é a política de execução padrão do Windows barrando o `activate`. Resolve com:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
>
> Ou, sem mexer em política nenhuma, usar o Prompt de Comando em vez do PowerShell e rodar `venv\Scripts\activate.bat`.

Deu certo quando aparece `(venv)` no começo da linha do terminal.

<details>
<summary>No Linux ou no Mac</summary>

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

</details>

Copiar o `.env.example` pra `.env`:

```powershell
copy .env.example .env
```

No Linux e no Mac, `cp .env.example .env`.

O `.env` **não vai pro GitHub** (está no `.gitignore`), então ele não aparece sozinho quando você clona o projeto: em cada computador é preciso criar o seu. O próprio `.env.example` explica variável por variável o que preencher, e tem no fim o passo a passo pra isso.

O que precisa ser mudado no `.env`:

| Variável | Pra que serve |
| --- | --- |
| `SECRET_KEY` | Assina o token do login. Gere a sua com `py -c "import secrets; print(secrets.token_hex(32))"` |
| `DATABASE_URL` | Conexão com o banco, no formato `mysql+pymysql://usuario:senha@host/indieSquad` |
| `HORAS_EXPIRACAO_TOKEN` | Quantas horas o login continua valendo |
| `ORIGENS_PERMITIDAS` | Endereços do front que podem chamar a API |
| `DEBUG` | `1` no seu computador, `0` em produção |
| `IA_CHAVE` | Chave da LLM que escreve a explicação do match. Pode ficar vazia |
| `IA_URL`, `IA_MODELO`, `IA_TEMPO_LIMITE` | Endereço, nome do modelo e tempo limite da LLM |

A `IA_CHAVE` é a única opcional: sem ela o match continua calculando e explicando a nota, só não passa pela LLM. A chave gratuita da Groq sai em [console.groq.com/keys](https://console.groq.com/keys), sem cartão, e o nome do modelo disponível no momento está em [console.groq.com/docs/models](https://console.groq.com/docs/models). Qualquer serviço que fale o protocolo da OpenAI funciona trocando `IA_URL` e `IA_MODELO`.

Rodar:

```powershell
py main.py
```

A API sobe em `http://localhost:5000`.

### 3. Frontend

A pasta `frontend` é HTML, CSS e JS puro, sem instalação. Abrir com o **Live Server** do VS Code (botão "Go Live" no canto de baixo), que serve em `http://127.0.0.1:5500`.

> Abrir o arquivo direto no navegador (`file://`) não funciona: o navegador bloqueia a conversa com a API. Tem que ser por um servidor.

Se o seu Live Server usar outra porta, adicionar ela em `ORIGENS_PERMITIDAS` no `.env`.


## Testando a API

A pasta `backend/http` tem um arquivo por endpoint, organizado por domínio, pra rodar direto do PyCharm ou do VS Code.

Rodar `backend/http/auth/login.http` primeiro: ele guarda o token automaticamente, e os outros arquivos já saem autenticados.


## Funcionalidades Implementadas

### Conta e perfil
1. Cadastrar usuário, com apelido único e senha guardada como hash
2. Login com token assinado (JWT)
3. Onboarding em três passos depois do cadastro, com opção de pular
4. Ver o próprio perfil
5. Editar o perfil (nome, apelido, e-mail e bio)
6. Definir o objetivo: montar equipe, entrar num projeto ou os dois
7. Definir a disponibilidade em horas por semana
8. Definir que tipos de colaboração aceita (portfólio, divisão de lucro, remunerado)
9. Adicionar e remover funções do perfil, com nível de Iniciante a Especialista
10. Adicionar e remover ferramentas do perfil
11. Adicionar e remover links de portfólio
12. Ver quanto falta pro perfil ficar completo, item por item
13. Trocar a senha, exigindo a senha atual
14. Apagar a própria conta
15. Ver o perfil público de qualquer pessoa pelo apelido
16. Ver as estatísticas públicas de um perfil: projetos, colaborações, taxa de conclusão e reputação

### Projetos
17. Publicar projeto com nome, descrição, gênero, engine, tipo de parceria e duração
18. Definir os marcos do projeto na publicação
19. Abrir uma vaga para cada função escolhida na publicação
20. Ver a página do projeto com ficha técnica, marcos, equipe e vagas
21. Editar o próprio projeto
22. Apagar o próprio projeto
23. Concluir o projeto, fechando as vagas abertas e liberando a avaliação
24. Ver a equipe do projeto, com o cargo de cada pessoa
25. Adicionar membro à equipe
26. Remover membro da equipe
27. Abrir vaga no projeto, com função e nível mínimo
28. Editar vaga
29. Apagar vaga
30. Ver todas as vagas de um projeto

### Candidaturas
31. Candidatar-se a uma vaga, com mensagem pro criador
32. Ver minhas candidaturas, com o status de cada uma
33. Editar a mensagem de uma candidatura pendente
34. Cancelar uma candidatura pendente
35. Ver as candidaturas recebidas, com reputação e funções de cada candidato
36. Aceitar candidatura: a pessoa entra na equipe, a vaga fecha e as outras são recusadas
37. Recusar candidatura

### Avaliações e reputação
38. Avaliar quem trabalhou no mesmo projeto, depois dele concluído
39. Avaliar por três critérios: comunicação, cumprimento de prazo e qualidade da entrega
40. Deixar um comentário na avaliação
41. Avaliação duplo-cega: cada lado só vê a do outro depois que os dois enviarem
42. Liberação automática da avaliação depois de 14 dias, se a outra pessoa não responder
43. Reputação calculada só com avaliação já liberada
44. Ver as avaliações recebidas no perfil

### Busca
45. Buscar profissionais por função
46. Buscar profissionais por categoria de função
47. Buscar profissionais por nome ou apelido
48. Filtrar profissionais por disponibilidade e tipo de colaboração
49. Buscar projetos por nome
50. Filtrar projetos por gênero, engine, tipo de parceria e status
51. Catálogo fixo de funções, agrupado por categoria
52. Catálogo fixo de ferramentas, agrupado por categoria

### Match e recomendação
53. Ver a compatibilidade entre o meu perfil e cada vaga, numa nota de 0 a 100
54. Compatibilidade calculada por sete critérios com peso: função, nível, tipo de parceria, ferramentas, disponibilidade, reputação e semelhança entre as descrições
55. Ver os pontos fortes e os pontos fracos da minha compatibilidade com a vaga
56. Ver os candidatos que mais combinam com uma vaga, ordenados pela nota, só pro criador do projeto
57. Explicação do match escrita por IA, com um texto montado pelo próprio sistema quando a IA não está configurada

### Dashboard
58. Ver projetos ativos, colaborações, taxa de conclusão e total de projetos
59. Ver os projetos ativos com o progresso das vagas preenchidas
60. Ver os projetos em que participo como membro
61. Ser avisado quando tem candidatura esperando resposta

### Sistema
62. Tema escuro e tema claro, com a escolha guardada
63. Layout adaptado pra celular
64. Números da página inicial vindos do banco
65. Autorização: só o criador mexe no projeto, só a própria pessoa mexe na conta
66. Rotas protegidas por login


## Próximos passos

Funcionalidades planejadas que ainda não foram implementadas:

- Notificações
- Mensagens entre usuários
- Upload de imagem para foto de perfil e logo do projeto
- Recuperação de senha por e-mail
