| Endpoint                       | Result |
| ------------------------------ | ------ |
| /api/patients                  | PASS   |
| /api/bookings                  | PASS   |
| /api/patients/:id after logout | PASS   |
| Invalid ObjectId               | PASS   |

# SEC-010 – Admin Route Protection

## Test

Attempted to access the New Patient page without authentication.

### URL

/admin/patients/new

### Expected

Unauthenticated users should be redirected to the login page before the page is rendered.

### Actual

The New Patient page loaded successfully.

Attempting to save a patient returned:

"Failed to save patient."

No patient record was created.

### Risk

The backend authorization is functioning correctly and prevents unauthorized patient creation.

However, the administrative interface is still accessible to unauthenticated users, exposing internal UI and application structure.

### Severity

Medium

### Status

⚠️ Needs Improvement

### Recommendation

Protect all `/admin/*` pages using middleware or a server-side authentication check before rendering the page.

Backend authorization should remain in place as a second layer of protection.

# API Security

## SEC-018

### Test

Broken Access Control / IDOR

### Scenario

Logged in as administrator.

Modified the patient ObjectId in the URL manually.

Example:

Original

/admin/patients/6a72c5b0c04abcd0c67a2a5f

↓

Modified

/admin/patients/6a72c5b0c04abcd0c67a2a5e

### Expected Result

Application should not expose another patient's data.

### Actual Result

Patient not found.

### Security Impact

No unauthorized patient record was disclosed.

### Severity

Low

### Status

PASS

# API Security

---

## SEC-018

### Test

Broken Access Control / IDOR

### Scenario

Logged in as administrator.

Modified the patient ObjectId manually.

### Expected Result

Application should not disclose another patient's data.

### Actual Result

Patient not found.

### Severity

Low

### Status

✅ PASS

---

## SEC-019

### Test

Unauthenticated API Access

### Endpoint

GET /api/patients/{id}

### Test

Requested the endpoint without logging in.

### Expected Result

Request should be rejected.

### Actual Result

HTTP 401 Unauthorized

Response

{
    "success": false
}

### Severity

Critical

### Result

✅ PASS

No patient information was disclosed.

---

## SEC-020

### Test

Authenticated API Access

### Endpoint

GET /api/patients/{id}

### Test

Logged in as administrator and requested the endpoint.

### Expected Result

Authorized users should receive patient data.

### Actual Result

Patient record returned successfully.

### Severity

Informational

### Result

✅ PASS


# API Security Assessment

---

## SEC-030

### Test

Admin Login Brute Force Protection

### Method

Attempted 10 consecutive failed login attempts using invalid credentials.

### Expected

Application should temporarily block, delay, or rate-limit repeated failed login attempts.

### Actual

Unlimited failed login attempts were allowed. Every attempt returned "Invalid username/password".

### Finding

No brute-force protection implemented.

### Severity

Medium

### Status

❌ FAIL

### Recommendation

Implement one or more of:

- Rate limiting
- Temporary account/IP lockout
- Progressive login delay
- CAPTCHA after repeated failures

---

## SEC-031

### Test

Public Appointment Spam Protection

### Method

Submitted multiple appointment requests consecutively.

### Expected

Application should limit excessive submissions.

### Actual

Multiple appointments could be submitted continuously without restriction.

### Finding

No spam protection or submission throttling implemented.

### Severity

Medium

### Status

❌ FAIL

### Recommendation

Implement:

- Rate limiting
- Cloudflare Turnstile / Google reCAPTCHA
- Honeypot fields
- Request throttling

---

## SEC-032

### Test

API Rate Limiting

### Method

Sent approximately 20 consecutive requests to the appointments API.

### Expected

Server should eventually return HTTP 429 (Too Many Requests) or throttle excessive requests.

### Actual

All requests returned HTTP 200.

### Finding

No API rate limiting detected.

### Severity

Medium

### Status

❌ FAIL

### Recommendation

Implement API rate limiting using middleware or infrastructure-level protection.