# Requisitos Funcionais:
- Deve permitir a transferência de valores entre contas.

# Regra de Negócio => RN:

- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;

- O balance (obtido através da rota /api/v1/statements/balance) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário;