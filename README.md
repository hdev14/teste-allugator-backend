<h1 align="center"> Test Allugator (Backend)</h1>

# Endpoints

| EMPLOYEE |
|--- |
| ```GET:/employess/name?name=value```  |
| ```GET:/employess/cpf?cpf=value```  |
| ```GET:/employess/role?role=value``` |
| ```GET:/employess/register-date?date=value```  |
| ```GET:/employess/uf?uf=value```  |
| ```GET:/employess/salary?min=value&max=value```  |
| ```GET:/employess/status?status=value```  |
| ```PUT:/employess/:id?``` |
| ```DELETE:/employess/:cpf``` |

<br/>

# Uso

## Pre-requisitos

Para iniciar esse projeto é necessário primeiramente instalar todas as dependências e tecnologias para executar o ambiente de desenvolvimento.

- [Node](https://nodejs.org/en/) & NPM/[Yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/engine/install/) & [Docker-compose](https://docs.docker.com/compose/install/)

### Instalar dependências

```sh
# Instalar com NPM
$ npm install
```

## Execução

Após o download de todas as tecnologias e dependências, basta seguir esses passos:

1. Execute o docker-compose:
```sh
$ docker-compose up -d
```
2. Copie o arquivo env.example e coloque os valores corretos para as variáveis de ambiente:
```sh
$ cp .env.example .env
```
3. Execute o comando de seed para popular o banco de dados:
```sh
npm run seed
```
4. Execute o projeto em modo de desenvolvimento:
```sh
npm run dev
```

## TDD

Esse projeto foi todo desenvolvido utilizando a metodologia de desenvolvimento Test Driven Development, por isso também foram criados alguns testes de integração e de unidade. Para executar os testes, basta utilizar o seguinte comando ``` npm run test ```

## Tecnologias utilizadas

- [X] NodeJS com Typescript;
- [X] ExpressJS;
- [X] Mongodb;
- [X] Docker e Docker-compose;
- [X] Jest com Supertest e jest Mongo(Testes);
- [X] ESLint e Editorconfig;
- [X] Husky e Lint-Staged;




