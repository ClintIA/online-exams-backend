# API de Exames do Paciente

## 1. Listar Exames do Paciente
Lista todos os exames do paciente com opções de filtro.

**GET** `/patient-exams`

### Headers
- `x-tenant-id`: ID do tenant (opcional se patientId for fornecido)

### Query Parameters
- `date`: Data do exame (opcional) - formato: "YYYY-MM-DD"
- `status`: Status do exame (opcional) - valores: "Scheduled", "InProgress", "Completed"
- `patientName`: Nome do paciente (opcional)
- `patientId`: ID do paciente (opcional)

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "tenant": [
      {
        "id": 1,
        "name": "Clínica Exemplo",
        "patientExams": [
          {
            "id": 1,
            "link": "https://exemplo.com/exame",
            "createdAt": "2024-03-30T10:00:00Z",
            "examDate": "2024-04-01T14:30:00Z",
            "uploadedAt": "2024-04-01T15:30:00Z",
            "status": "Completed",
            "exam": {
              "id": 1,
              "exam_name": "Raio-X"
            }
          }
        ]
      }
    ]
  },
  "message": "Exames listados com sucesso"
}
```

## 2. Criar Exame do Paciente
Cria um novo exame para um paciente.

**POST** `/patient-exams`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Body
```json
{
  "patientId": 1,
  "examId": 1,
  "examDate": "2024-04-01T14:30:00Z",
  "doctorId": 1,
  "userId": 1
}
```

### Resposta de Sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientId": 1,
    "examId": 1,
    "examDate": "2024-04-01T14:30:00Z",
    "status": "Scheduled"
  },
  "message": "Exame do paciente criado com sucesso"
}
```

## 3. Atualizar Exame do Paciente
Atualiza as informações de um exame existente.

**PUT** `/patient-exams/:examId`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Parâmetros da URL
- `examId`: ID do exame (obrigatório)

### Body
```json
{
  "status": "Completed",
  "link": "https://exemplo.com/exame-atualizado"
}
```

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "Completed",
    "link": "https://exemplo.com/exame-atualizado"
  },
  "message": "Exame do paciente atualizado com sucesso"
}
```

## 4. Deletar Exame do Paciente
Remove um exame do sistema.

**DELETE** `/patient-exams/:examId`

### Headers
- `x-tenant-id`: ID do tenant (obrigatório)

### Parâmetros da URL
- `examId`: ID do exame (obrigatório)

### Resposta de Sucesso
```json
{
  "success": true,
  "data": "Exame do paciente deletado com sucesso",
  "message": "Exame do paciente deletado com sucesso"
}
```

## Respostas de Erro

### Erro de Validação (400)
```json
{
  "success": false,
  "error": {
    "message": "É necessário passar o tenantId ou patientId"
  }
}
```

### Erro de Autenticação (401)
```json
{
  "success": false,
  "error": {
    "message": "Não autorizado"
  }
}
```

### Erro de Acesso (403)
```json
{
  "success": false,
  "error": {
    "message": "Sem permissão para acessar este recurso"
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
1. O tenantId é obrigatório para todas as operações exceto listagem quando o patientId é fornecido
2. O status do exame pode ser apenas: "Scheduled", "InProgress" ou "Completed"
3. As datas devem ser fornecidas no formato ISO 8601
4. A listagem de exames agrupa os resultados por tenant
5. O link do exame é opcional e só pode ser adicionado/atualizado após a criação
6. Todas as operações de escrita (POST, PUT, DELETE) requerem autenticação
