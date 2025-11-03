### rodar com docker
1. para subir os containers:
   ```bash
   docker-compose up --build
   ```
   isso já levanta a api, mongo, redis, rabbitmq e o worker consumidor.
2. a api vai estar escutando em `http://localhost:3000/api`.

### rodar local (sem docker)
1. instale as dependências:
   ```bash
   npm install
   ```
2. gere os arquivos JavaScript (obrigatório, pois `dist/` não é versionado):
   ```bash
   npm run build
   ```
3. suba a API:
   ```bash
   npm run start
   ```
4. (opcional) execute o worker para consumir a fila:
   ```bash
   npm run consumer
   ```

### endpoints do serviço
| método | rota                  | descrição                              |
| ------ | --------------------- | -------------------------------------- |
| POST   | `/api/customers`      | cria novo cliente                      |
| GET    | `/api/customers/:id`  | busca cliente por id (cache com redis) |
| GET    | `/api/customers`      | lista todos os clientes                |
| PUT    | `/api/customers/:id`  | atualiza dados do cliente              |

### retorno esperado:
```
{ "nome": "nomedousuario", "email": "emaildousuario@email.com", "telefone": "0000000000" }
```
### para executar os endpoints via bash
- **criar cliente:**
  ```bash
  curl -X POST "http://localhost:3000/api/customers" \
    -H "Content-Type: application/json" \
    -d '{"nome":"fulano","email":"fulano@email.com","telefone":"11999999999"}'
  ```
- **listar clientes:**
  ```bash
  curl "http://localhost:3000/api/customers"
  ```
- **ver detalhes (substitua `<id>` pelo valor retornado na criação):**
  ``` bash
  curl "http://localhost:3000/api/customers/<id>"
  ```
- **atualizar cadastro:**
  ```bash
  curl -X PUT "http://localhost:3000/api/customers/<id>" \
    -H "Content-Type: application/json" \
    -d '{"telefone":"11888887777"}'
  ```

### obs: cache e mensageria
- quando um cliente é cadastrado, mando a info pra fila e o worker consome logando o evento.
- consulta por id tenta primeiro no redis, quando não acha, busca no mongo e salva no cache por 60 segundos.
- sobre mensageria: eu ainda não tenho experiência prática ou teórica com esse assunto. por isso implementei um fluxo simples seguindo a documentaçao oficial do rabbitmq para garantir que o requisito fosse cumprido.

### obs: testes
- os testes unitários são simples, focados nos casos de uso usando jest com mocks para repositório, cache e mensageria.

