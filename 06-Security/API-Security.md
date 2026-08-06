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