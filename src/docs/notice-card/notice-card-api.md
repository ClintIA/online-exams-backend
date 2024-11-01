# Notice Card API Documentation

## Overview

This API provides functionalities to manage notice cards in a multi-tenant architecture. It allows users to create, list, and delete notice cards. Each operation requires the tenant ID to ensure data separation between different tenants.

## Endpoints

### 1. List Notice Cards

- **Endpoint:** `GET /api/notice-cards`
- **Function:** `listNoticeCardController`
- **Description:** Retrieves a list of notice cards based on provided filters.
- **Query Parameters:**
    - `message` (optional): A string to filter cards by message content.
    - `createdBy` (optional): An integer to filter cards by creator's ID.
    - `startDate` (optional): A string representing the starting date for filtering cards.
    - `endDate` (optional): A string representing the ending date for filtering cards.
- **Responses:**
    - **200 OK:** Returns a list of notice cards.
    - **400 Bad Request:** If `tenantId` is missing or if there are validation errors.
    - **500 Internal Server Error:** If an unexpected error occurs.

### 2. Create Notice Card

- **Endpoint:** `POST /api/notice-cards`
- **Function:** `createCardController`
- **Description:** Creates a new notice card.
- **Request Body:**
    - `message` (required): The content of the notice card.
    - `createdBy` (required): The ID of the user creating the card.
    - `date` (required): The date when the notice is created.
- **Responses:**
    - **200 OK:** Returns the created notice card.
    - **400 Bad Request:** If any required fields are missing or invalid.
    - **500 Internal Server Error:** If an unexpected error occurs.

### 3. Delete Notice Card

- **Endpoint:** `DELETE /api/notice-cards/:cardId`
- **Function:** `deleteCardController`
- **Description:** Deletes a notice card based on the card ID provided in the URL parameters.
- **URL Parameters:**
    - `cardId` (required): The ID of the notice card to be deleted.
- **Responses:**
    - **200 OK:** Returns a success message if the card was deleted.
    - **400 Bad Request:** If `cardId` is not provided.
    - **404 Not Found:** If the card with the specified ID does not exist.
    - **500 Internal Server Error:** If an unexpected error occurs.

## Error Handling

All endpoints return appropriate error responses with relevant HTTP status codes and messages.

- **Success Response Format:**
    ```json
    {
      "status": "success",
      "data": {}, 
      "message": "string"
    }
    ```

- **Error Response Format:**
    ```json
    {
      "status": "error",
      "message": "string" 
    }
    ```

## Security

Ensure that the `tenantId` is always passed and validated to prevent unauthorized access to notice cards of other tenants. Use middleware to handle authentication and validation as required.

## Utilities

This API uses utility functions for standard responses:

- `successResponse(res, data, message)`
- `errorResponse(res, error)`
- `customErrorResponse(res, message)`

These functions standardize the response format across the application.

## Conclusion

This documentation outlines the basic operations available for managing notice cards in the application. Ensure that all requests are made with the appropriate headers and parameters to interact successfully with the API.