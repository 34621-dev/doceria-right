# 📖 Documentação da API REST - Doceria System

Esta documentação descreve todos os endpoints disponibilizados pelo backend da Doceria para gerenciamento dos produtos (doces).

---

## 🌐 Informações Gerais

- **Base URL Local**: `http://localhost:3000`
- **Base URL Vercel**: `https://<seu-projeto>.vercel.app`
- **Content-Type Padrão**: `application/json; charset=utf-8`

---

## 🧁 Modelo de Dados (`Doce`)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Sim (auto) | Identificador único gerado pelo MongoDB |
| `nome` | String | Sim | Nome do doce (ex: `Bolo de Cenoura com Chocolate`) |
| `tipo` | String | Sim | Categoria/tipo do doce (ex: `Bolo`, `Torta`, `Brigadeiro`, `Cupcake`) |
| `preco` | Number | Sim | Valor monetário em reais (ex: `14.50`) |
| `fotoUrl` | String | Sim | URL pública da imagem ilustrativa |
| `createdAt` | Date | Sim (auto) | Data e hora de criação do registro |

---

## 📌 Endpoints

### 1. Listar todos os doces
Retorna a lista de todos os doces cadastrados, ordenados pelos mais recentes.

- **Método**: `GET`
- **Rota**: `/api/doces`
- **Status Code de Sucesso**: `200 OK`

#### Exemplo de Requisição (cURL):
```bash
curl -X GET http://localhost:3000/api/doces
```

#### Resposta de Sucesso (`200 OK`):
```json
[
  {
    "_id": "6741b2c45a19e81b84920001",
    "nome": "Bolo de Cenoura com Chocolate",
    "tipo": "Bolo",
    "preco": 14.5,
    "fotoUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    "createdAt": "2026-09-22T15:00:00.000Z",
    "__v": 0
  },
  {
    "_id": "6741b2c45a19e81b84920002",
    "nome": "Brigadeiro Gourmet Belga",
    "tipo": "Brigadeiro",
    "preco": 4.5,
    "fotoUrl": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55",
    "createdAt": "2026-09-22T14:30:00.000Z",
    "__v": 0
  }
]
```

---

### 2. Obter doce por ID
Retorna os detalhes de um doce específico pelo seu `_id`.

- **Método**: `GET`
- **Rota**: `/api/doces/:id`
- **Status Codes**: `200 OK`, `404 Not Found`, `400 Bad Request`

#### Exemplo de Requisição (cURL):
```bash
curl -X GET http://localhost:3000/api/doces/6741b2c45a19e81b84920001
```

#### Resposta de Sucesso (`200 OK`):
```json
{
  "_id": "6741b2c45a19e81b84920001",
  "nome": "Bolo de Cenoura com Chocolate",
  "tipo": "Bolo",
  "preco": 14.5,
  "fotoUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  "createdAt": "2026-09-22T15:00:00.000Z"
}
```

---

### 3. Cadastrar um novo doce
Cria um novo doce no banco de dados.

- **Método**: `POST`
- **Rota**: `/api/doces`
- **Headers**: `Content-Type: application/json`
- **Status Codes**: `201 Created`, `400 Bad Request`

#### Payload da Requisição:
```json
{
  "nome": "Cupcake Red Velvet",
  "tipo": "Cupcake",
  "preco": 9.90,
  "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
}
```

#### Exemplo de Requisição (cURL):
```bash
curl -X POST http://localhost:3000/api/doces \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cupcake Red Velvet",
    "tipo": "Cupcake",
    "preco": 9.90,
    "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
  }'
```

#### Resposta de Sucesso (`201 Created`):
```json
{
  "mensagem": "Doce cadastrado com sucesso!",
  "doce": {
    "_id": "6741b2c45a19e81b84920003",
    "nome": "Cupcake Red Velvet",
    "tipo": "Cupcake",
    "preco": 9.9,
    "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
    "createdAt": "2026-09-22T15:10:00.000Z",
    "__v": 0
  }
}
```

#### Resposta de Erro (`400 Bad Request`):
```json
{
  "erro": "Campos obrigatórios ausentes: nome, tipo, preco e fotoUrl devem ser fornecidos."
}
```

---

### 4. Atualizar um doce existente
Atualiza os dados de um doce já cadastrado pelo seu `_id`.

- **Método**: `PUT`
- **Rota**: `/api/doces/:id`
- **Headers**: `Content-Type: application/json`
- **Status Codes**: `200 OK`, `400 Bad Request`, `404 Not Found`

#### Payload da Requisição:
```json
{
  "nome": "Cupcake Red Velvet com Cream Cheese",
  "tipo": "Cupcake",
  "preco": 11.50,
  "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
}
```

#### Exemplo de Requisição (cURL):
```bash
curl -X PUT http://localhost:3000/api/doces/6741b2c45a19e81b84920003 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cupcake Red Velvet com Cream Cheese",
    "tipo": "Cupcake",
    "preco": 11.50,
    "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
  }'
```

#### Resposta de Sucesso (`200 OK`):
```json
{
  "mensagem": "Doce atualizado com sucesso!",
  "doce": {
    "_id": "6741b2c45a19e81b84920003",
    "nome": "Cupcake Red Velvet com Cream Cheese",
    "tipo": "Cupcake",
    "preco": 11.5,
    "fotoUrl": "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
    "createdAt": "2026-09-22T15:10:00.000Z",
    "__v": 0
  }
}
```

---

### 5. Excluir um doce
Remove o doce especificado pelo seu `_id`.

- **Método**: `DELETE`
- **Rota**: `/api/doces/:id`
- **Status Codes**: `200 OK`, `404 Not Found`, `400 Bad Request`

#### Exemplo de Requisição (cURL):
```bash
curl -X DELETE http://localhost:3000/api/doces/6741b2c45a19e81b84920003
```

#### Resposta de Sucesso (`200 OK`):
```json
{
  "mensagem": "Doce removido com sucesso!",
  "id": "6741b2c45a19e81b84920003"
}
```

#### Resposta de Erro (`404 Not Found`):
```json
{
  "erro": "Doce não encontrado para o ID informado."
}
```
