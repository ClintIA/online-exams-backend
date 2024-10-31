# API de Listagem de Médicos

## Endpoint
`GET /doctors`

## Descrição
Retorna uma lista paginada de médicos.

## Headers Necessários
- `x-tenant-id`: ID do tenant (obrigatório)

## Parâmetros da Query
- `page`: Número da página (opcional, padrão: 1)
- `take`: Quantidade de registros por página (opcional, padrão: 10)
- `skip`: Quantidade de registros para pular (opcional, padrão: 0)

## Exemplo de Requisição
```bash
GET /doctors?page=1&take=10
Header: x-tenant-id: 123
```

## Exemplo de Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Dr. João Silva",
        "specialty": "Cardiologia"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "take": 10,
      "remaining": 90
    }
  },
  "message": "Showing 10 of 100 doctors (90 remaining)"
}
```

## Possíveis Erros

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Invalid or missing tenant ID"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## Observações
- Todos os parâmetros numéricos devem ser positivos
- O tenant ID é obrigatório
- A paginação começa em 1
