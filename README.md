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
1. Ver, atualizar, remover e adicionar informações do próprio perfil
2. Trocar a senha, exigindo a senha atual
3. Apagar a própria conta
4. Ver o perfil público de qualquer pessoa pelo apelido
5. Ver projetos ativos, colaborações, taxa de conclusão e total de projetos
6. Ver os projetos ativos com o progresso das vagas preenchidas
7. Ver os projetos em que participo como membro
8. Ser avisado quando tem candidatura esperando resposta

### Projetos
9. Publicar projeto com nome, descrição, gênero, engine, tipo de parceria e duração
10. Publicar vagas públicas onde usuários podem visualizar, verificar compatibilidade e se inscrever
11. Ver, atualizar, remover e adicionar informações sobre o próprio projeto
12. Adicionar e remover membros do projeto
13. Concluir o projeto, fechando as vagas abertas e liberando a avaliação
14. Ver informações sobre um projeto no qual é membro

### Candidaturas
15. Realizar, cancelar, editar e visualizar as próprias candidaturas
16. Visualizar, recusar ou aceitar as candidaturas feitas, com reputação e funções de cada candidato

### Avaliações e reputação
17. Avaliar quem esteve na mesma equipe, depois do projeto concluído
18. Deixar um comentário na avaliação
19. Avaliação duplo-cega: cada lado só vê a do outro depois que os dois enviarem
20. Ver as avaliações recebidas no perfil dos usuários

### Busca
21. Buscar profissionais por: nome, função
22. Buscar projetos por: nome
23. Filtragem de profissionais por: nome, função, disponibilidade, tipo de colaboração
24. Filtragem de projetos por: nome, gênero, engine, tipo de parceria e status

### Match e recomendação
25. Ver a compatibilidade entre o meu perfil e cada vaga, numa nota de 0 a 100
26. Compatibilidade calculada por sete critérios com peso: função, nível, tipo de parceria, ferramentas, disponibilidade, reputação e semelhança entre as descrições
27. Ver os candidatos que mais combinam com uma vaga, ordenados pela nota, só pro criador do projeto

### Sistema
28. Tema escuro e tema claro, com a escolha guardada

### Segurança
29. Rotas protegidas por login
30. Autorização: só o criador mexe no projeto, só a própria pessoa mexe na conta
31. Cadastrar usuário, com apelido único e senha guardada como hash


## Próximos passos

Funcionalidades planejadas que ainda não foram implementadas:

- Notificações
- Mensagens entre usuários
- Upload de imagem para foto de perfil e logo do projeto
- Recuperação de senha por e-mail
