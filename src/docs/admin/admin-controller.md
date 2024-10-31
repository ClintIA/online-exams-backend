# API de Administradores e Médicos

## 1. Listar Administradores
Retorna todos os administradores do tenant.

**GET** `/admins`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Resposta de Sucesso
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "cpf": "123.456.789-00"
    }
  ],
  "message": "Administrators listed successfully"
}
```

## 2. Buscar Administrador por CPF
Busca um administrador específico pelo CPF.

**POST** `/admins/cpf`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Body
```json
{
  "adminCpf": "123.456.789-00"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João Silva",
    "cpf": "123.456.789-00"
  },
  "message": "Administrator found by CPF"
}
```

## 3. Buscar Administradores por Nome
Busca administradores pelo nome.

**POST** `/admins/name`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Body
```json
{
  "fullName": "João Silva"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "cpf": "123.456.789-00"
    }
  ],
  "message": "Administrators found by name"
}
```

## 4. Buscar Médicos por Nome do Exame
Busca médicos associados a um determinado exame.

**GET** `/doctors/exam`

### Query Parameters
- `examName`: Nome do exame (obrigatório)

### Resposta de Sucesso
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dr. Maria Santos",
      "specialty": "Cardiologia"
    }
  ],
  "message": "Doctors associated with the exam listed successfully"
}
```

## Respostas de Erro

### Erro de Validação (400)
```json
{
  "success": false,
  "error": {
    "message": "Invalid tenant ID"
  }
}
```

### Erro Interno (500)
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

## Observações
- Todos os endpoints requerem um tenant ID válido (exceto busca por exame)
- O CPF deve estar em formato válido (XXX.XXX.XXX-XX ou XXXXXXXXXXX)
- O nome do exame é case sensitive
