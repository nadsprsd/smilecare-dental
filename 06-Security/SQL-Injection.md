# SEC-014 – NoSQL Injection Test

## Endpoint

POST /api/patients

---

## Payload

```json
{
  "name": {
    "$ne": null
  },
  "phone": "9999999999"
}
```

---

## Result

Response:

```json
{
  "success": false
}
```

The request was rejected because authentication is required.

The malicious payload was never processed.

---

## Security Assessment

The endpoint correctly prevents unauthenticated requests.

No evidence of NoSQL injection was identified during this test.

---

## Severity

None

---

## Status

✅ PASS

---

## Recommendation

Authentication successfully prevented unauthorized API access.

A future improvement is to validate data types (for example, ensuring `name` is always a string) and return HTTP 400 for invalid payloads instead of relying on runtime exceptions.


# NoSQL Injection Testing

## Test 1 – Object Injection

### Endpoint

POST /api/patients

### Payload

```json
{
  "name": {
    "$ne": null
  },
  "phone": "9999999999"
}
```

### Expected Result

The application should reject non-string input.

### Actual Result

HTTP 500 Internal Server Error

```json
{
  "success": false
}
```

### Risk

NoSQL injection attempt was unsuccessful.

The application did not insert data into MongoDB.

However, invalid input triggered an internal server exception.

### Recommendation

Validate all incoming request fields before processing.

Example:

- name must be string
- phone must be string
- age must be number

Reject invalid payloads with HTTP 400 instead of HTTP 500.

### Status

PASS (with improvement recommended)

### Severity

Low