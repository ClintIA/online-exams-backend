# API de Autenticação e Registro

## 1. Registrar Administrador
Cria uma nova conta de administrador no sistema.

**POST** `/admin/register`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Body
```json
{
  "email": "admin@exemplo.com",
  "adminCpf": "123.456.789-00",
  "password": "senha123",
  "fullName": "Nome do Administrador"
}
```

### Resposta de Sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@exemplo.com",
    "fullName": "Nome do Administrador"
  },
  "message": "Admin registrado com sucesso"
}
```

## 2. Registrar Paciente
Cria uma nova conta de paciente no sistema.

**POST** `/patient/register`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Body
```json
{
  "full_name": "Nome do Paciente",
  "cpf": "123.456.789-00",
  "dob": "1990-01-01",
  "email": "paciente@exemplo.com",
  "phone": "(11) 98765-4321",
  "address": "Rua Exemplo, 123",
  "gender": "M",
  "health_card_number": "123456789"
}
```

### Observações
- A senha do paciente é gerada automaticamente baseada nos dados fornecidos
- O campo `dob` deve estar no formato "YYYY-MM-DD"

### Resposta de Sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Nome do Paciente",
    "email": "paciente@exemplo.com"
  },
  "message": "Paciente registrado com sucesso"
}
```

## 3. Login de Paciente
Autentica um paciente usando CPF e senha.

**POST** `/patient/login`

### Body
```json
{
  "cpf": "123.456.789-00",
  "password": "senha123"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login realizado com sucesso"
}
```

## 4. Login de Administrador
Autentica um administrador usando email e senha.

**POST** `/admin/login`

### Body
```json
{
  "email": "admin@exemplo.com",
  "password": "senha123"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login realizado com sucesso"
}
```

## Respostas de Erro

### Erro de Autenticação (401)
```json
{
  "success": false,
  "error": {
    "message": "Credenciais inválidas"
  }
}
```

### Erro de Validação (400)
```json
{
  "success": false,
  "error": {
    "message": "Dados inválidos"
  }
}
```

### Erro Interno (500)
```json
{
  "success": false,
  "error": {
    "message": "Erro interno do servidor"
  }
}
```

## Observações Importantes
1. Todos os endpoints de registro requerem um tenant ID válido
2. A senha do paciente é gerada automaticamente pelo sistema
3. O token retornado nos endpoints de login deve ser incluído no header das requisições subsequentes
4. O CPF deve estar em formato válido (XXX.XXX.XXX-XX ou XXXXXXXXXXX)
5. O email deve ser único no sistema
6. Todos os campos são obrigatórios, exceto quando especificado
