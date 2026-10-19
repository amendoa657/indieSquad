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

Abrir o MySQL e rodar, nessa ordem:

```sql
source backend/database/scriptCreateIndieSquadV2.sql;
source backend/database/seedIndieSquad.sql;
```

O primeiro cria o banco `indieSquad` inteiro. O segundo preenche o catálogo de funções e ferramentas (que o sistema precisa pra funcionar) e cria alguns usuários e projetos de exemplo.

> Quem já tem o banco da versão antiga roda `backend/database/scriptAtualizacaoV2.sql` em vez do primeiro: ele atualiza o banco preservando os dados que já estão lá.

A senha de todos os usuários de exemplo é `indiesquad123`.

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # no Windows
source venv/bin/activate       # no Linux e no Mac
pip install -r requirements.txt
```

Copiar o `.env.example` pra `.env` e preencher:

```bash
cp .env.example .env
```

O que precisa ser mudado no `.env`:

| Variável | Pra que serve |
| --- | --- |
| `SECRET_KEY` | Assina o token do login. Gere a sua com `python -c "import secrets; print(secrets.token_hex(32))"` |
| `DATABASE_URL` | Conexão com o banco, no formato `mysql+pymysql://usuario:senha@host/indieSquad` |
| `HORAS_EXPIRACAO_TOKEN` | Quantas horas o login continua valendo |
| `ORIGENS_PERMITIDAS` | Endereços do front que podem chamar a API |
| `DEBUG` | `1` no seu computador, `0` em produção |

Rodar:

```bash
python main.py
```

A API sobe em `http://localhost:5000`.

### 3. Frontend

A pasta `frontend` é HTML, CSS e JS puro, sem instalação. Abrir com o **Live Server** do VS Code (botão "Go Live"), que serve em `http://127.0.0.1:5500`.

> Abrir o arquivo direto no navegador (`file://`) não funciona: o navegador bloqueia a conversa com a API. Tem que ser por um servidor.

Se o seu Live Server usar outra porta, adicionar ela em `ORIGENS_PERMITIDAS` no `.env`.


## Testando a API

A pasta `backend/http` tem um arquivo por endpoint, organizado por domínio, pra rodar direto do PyCharm ou do VS Code.

Rodar `backend/http/auth/login.http` primeiro: ele guarda o token automaticamente, e os outros arquivos já saem autenticados.


## Funcionalidades Implementadas

### Conta e perfil
1. Cadastrar usuário (apelido único, objetivo e senha com hash)
2. Login com token assinado (JWT)
3. Ver e editar o próprio perfil
4. Trocar a senha (exigindo a senha atual)
5. Perfil público de qualquer pessoa pelo apelido (`perfil.html?handle=thales`)
6. Gerenciar as próprias funções, com nível de Iniciante a Especialista
7. Disponibilidade em horas por semana e tipos de colaboração aceitos
8. Apagar a própria conta

### Projetos
9. Publicar projeto com gênero, engine, tipo de parceria, duração e marcos
10. Ver os detalhes, a ficha técnica, os marcos e a equipe de um projeto
11. Editar e apagar o próprio projeto
12. Concluir projeto (fecha as vagas abertas e libera a avaliação da equipe)
13. Abrir, editar e fechar vagas no próprio projeto
14. Adicionar e remover membros da equipe

### Candidaturas
15. Candidatar-se a uma vaga, com mensagem pro criador
16. Ver minhas candidaturas, com o status de cada uma
17. Cancelar uma candidatura pendente
18. Aceitar ou recusar candidatura (o aceite coloca a pessoa na equipe, fecha a vaga e recusa as outras daquela vaga)

### Busca e dashboard
19. Buscar profissionais por função, nome, disponibilidade e tipo de colaboração
20. Buscar projetos por nome, gênero, engine, tipo de parceria e status
21. Dashboard com projetos ativos, colaborações, taxa de conclusão e candidaturas esperando resposta
22. Reputação do usuário calculada a partir das avaliações recebidas


## Próximos passos

Funcionalidades planejadas que ainda não foram implementadas:

- Tela de avaliação entre os membros depois do projeto concluído
- Onboarding em etapas e links de portfólio no perfil
- Cálculo de compatibilidade entre pessoa e vaga
- Notificações
- Mensagens entre usuários
- Upload de imagem para foto de perfil e logo do projeto
- Recuperação de senha por e-mail
