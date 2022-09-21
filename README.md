# <center> FinAPI </center>

<p align="center">
  <img src=assets/xenonstack-test-driven-development-tools-best-practices.png>
</p>


## About: 

Inserindo testes de integração e testes unitários nas funcionalidades da API.
Exercício faz parte do módulo 4 do curso Ignite - NodeJS da Rocketseat.

### Rotas da aplicação: 

#### POST `/api/v1/users`:

A rota recebe `name`, `email` e **password** dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status *201*. 

#### POST `/api/v1/sessions`:

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT. 

<aside>
💡 Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.
</aside>

#### GET `/api/v1/profile`:

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

#### GET `/api/v1/statements/balance`

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

#### POST `/api/v1/statements/deposit`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

#### POST `/api/v1/statements/withdraw`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`. 

#### GET `/api/v1/statements/:statement_id`:

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.

<br/><br/>
## 💻 Installation, Dependencies, and Running the Project
:exclamation: *IMPORTANT :*  **To run the project, you are expected to have the following tools installed on your machine:**

* NPM ou Yarn.
* NodeJS.

**1.** Clone este repositório 
```
git@github.com:Rafael-Albano/ignite-unit-test-challenge.git
``` 
**2.** Vá até o diretório raiz do projeto
```
cd ignite-unit-test-challenge.git
``` 
**3.** Instale as dependências necessárias
```
yarn 
ou
npm install
```
**4.** Execute o teste da aplicação.
```
yarn test
```

## :floppy_disk: Usando a Aplicação
Para realização de **requisições** na aplicação, deve ser utilizado o **Insomnia** ou **Postman**
Atentar-se aos parâmetros necessários no **Header**.

## :syringe: Evidência de Testes
Nesta aplicação, são contemplados **Testes Unitários e Testes de Integração** utilizando o framework de testes **Jest**, visando garantir o correto funcionamento das funcionalidades e manter a aplicação de acordo com os requisitos. <br/>

- **Testes Desenvolvido por Rafael** [**Rafael**](https://www.linkedin.com/in/rafael-luis-albano/) 🤖
