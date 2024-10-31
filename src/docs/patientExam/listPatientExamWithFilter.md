# Patient Exams Service Documentation

## Table of Contents
- [Overview](#overview)
- [Types and Interfaces](#types-and-interfaces)
- [Functions](#functions)
    - [listPatientExams](#listpatientexams)
    - [deletePatientExam](#deletepatientexam)
    - [updatePatientExam](#updatepatientexam)
    - [createPatientExam](#createpatientexam)
- [Usage Examples](#usage-examples)
- [Dependencies](#dependencies)

## Overview

The Patient Exams Service provides a comprehensive solution for managing medical examinations in a multi-tenant healthcare system. This service handles the creation, retrieval, updating, and deletion of patient examinations with support for various filtering options and status management.

## Types and Interfaces

### FilterParams
```typescript
interface FilterParams {
    startDate?: string;
    endDate?: string;
    status: 'Scheduled' | 'InProgress' | 'Completed';
    patientName?: string;
    patientId?: number;
    tenantId?: number;
}
```

## Functions

### listPatientExams

Lists and filters patient examinations based on provided criteria.

**Parameters:**
- `filters: FilterParams` - Object containing filter options:
    - `startDate` (optional): Starting date for exam filtering
    - `endDate` (optional): End date for exam filtering
    - `status`: Current exam status
    - `patientName` (optional): Patient's name for filtering
    - `patientId` (optional): Specific patient ID
    - `tenantId` (optional): Tenant identifier

**Returns:**
- `Promise<PatientExams[]>`: Array of patient examinations matching the filters

**Example:**
```typescript
const exams = await listPatientExams({
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'Scheduled',
    tenantId: 1
});
```

### deletePatientExam

Removes a specific patient examination from the system.

**Parameters:**
- `examId: number` - Identifier of the exam to delete
- `tenantId: number` - Tenant identifier

**Throws:**
- Error when exam is not found

**Example:**
```typescript
await deletePatientExam(123, 1);
```

### updatePatientExam

Updates the status and/or link of an existing patient examination.

**Parameters:**
- `examId: number` - Exam identifier
- `examData: object` - Update data containing:
    - `status?: 'Scheduled' | 'InProgress' | 'Completed'`
    - `link?: string`
- `tenantId: number` - Tenant identifier

**Returns:**
- Object with success message

**Throws:**
- Error when exam is not found
- Error when attempting to complete exam without providing a link

**Example:**
```typescript
const result = await updatePatientExam(123, {
    status: 'Completed',
    link: 'https://results.example.com'
}, 1);
```

### createPatientExam

Creates a new patient examination record.

**Parameters:**
- `examData: object` - Exam creation data:
    - `patientId: number`
    - `examId: number`
    - `examDate: Date`
    - `userId: number`
    - `doctorId: number`
- `tenantId: number` - Tenant identifier

**Returns:**
- Object with success message

**Example:**
```typescript
const result = await createPatientExam({
    patientId: 1,
    examId: 100,
    examDate: new Date(),
    userId: 1,
    doctorId: 50
}, 1);
```

## Usage Examples

### Complete Flow Example

```typescript
// Creating a new exam
const newExam = await createPatientExam({
    patientId: 1,
    examId: 100,
    examDate: new Date(),
    userId: 1,
    doctorId: 50
}, 1);

// Updating exam status
await updatePatientExam(100, {
    status: 'InProgress'
}, 1);

// Completing exam with results
await updatePatientExam(100, {
    status: 'Completed',
    link: 'https://results.example.com'
}, 1);

// Listing exams for a specific patient
const patientExams = await listPatientExams({
    patientId: 1,
    status: 'Completed'
});
```

## Dependencies

- **TypeORM**: Used for database operations
    - `Between`
    - `Like`
- **Repositories**:
    - `patientExamsRepository`
    - `tenantExamsRepository`
- **Services**:
    - `adminService` (for doctor lookup)
- **Models**:
    - `PatientExams`

---

**Note**: This service implements multi-tenant architecture and includes proper validation for status transitions and required fields. All operations are tenant-aware to ensure data isolation between different tenants.

For any issues or feature requests, please contact the development team.