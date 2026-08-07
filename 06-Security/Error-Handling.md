# Error Handling Assessment

## Overview

The application was tested for improper error handling and information disclosure.

The objective was to verify that internal implementation details are not exposed to unauthorized users.

---

## SEC-043

### Test

Invalid ObjectId

### URL

GET /api/patients/invalid-object-id

### Expected

401 Unauthorized or generic error.

### Actual Result

{
  "success": false
}

### Finding

No stack trace exposed.

No MongoDB details leaked.

### Severity

Low

### Status

✅ PASS

---

## SEC-044

### Test

Malformed JSON Request

### Request

POST /api/patients

Invalid JSON body submitted.

### Result

HTTP 500 Internal Server Error

### Terminal

SyntaxError: Expected ',' or '}' after property value in JSON...

### Finding

The API correctly hides internal errors from the client.

However malformed JSON currently returns HTTP 500 instead of HTTP 400 Bad Request.

This should be improved.

### Recommendation

Catch JSON parsing errors separately and return:

HTTP 400

{
    "success": false,
    "message": "Invalid JSON"
}

### Severity

Low

### Status

⚠ Needs Improvement

---

## SEC-045

### Test

Unsupported HTTP Method

### Result

Method restrictions enforced.

Unsupported methods are not processed.

### Severity

Low

### Status

✅ PASS

---

## SEC-046

### Test

Information Disclosure

### Terminal Output

Only server-side error logs were displayed.

Examples:

POST /api/patients: SyntaxError...

No environment variables exposed.

No MongoDB URI exposed.

No passwords exposed.

No filesystem paths leaked to the client.

### Finding

Sensitive information remains server-side.

### Severity

Low

### Status

✅ PASS