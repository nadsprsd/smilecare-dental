# SEC-011 – Stored XSS Test

## Objective

Verify that user-supplied input is safely escaped when displayed in the application.

---

## Test

Field:

Patient Name

Payload:

<script>alert("XSS")</script>

---

## Expected

- No JavaScript execution.
- Payload stored as plain text or rejected.
- No browser alert.
- Patient record remains accessible.

---

## Actual Result

The patient record was created successfully.

The application displayed:

<script>alert("XSS")</script>

as plain text.

No JavaScript executed.

No browser alert appeared.

---

## Risk

None identified.

The application correctly escaped HTML characters before rendering.

---

## Severity

None

---

## Status

✅ PASS

---

## Recommendation

Continue escaping all user-generated content before rendering.

Do not introduce `dangerouslySetInnerHTML` or similar raw HTML rendering for patient data unless content is fully sanitized.


# SEC-012 – HTML / Image XSS Injection

## Objective

Verify that HTML tags and image event handlers are not executed when rendered.

---

## Test

Field:
Medical History

Payload:

<img src=x onerror=alert('XSS')>

---

## Expected

- No JavaScript execution
- No popup
- HTML displayed safely
- No image rendering

---

## Actual Result

The payload was displayed as plain text.

No JavaScript executed.

No browser alert appeared.

The application safely escaped the HTML.

---

## Severity

None

---

## Status

✅ PASS

---

## Recommendation

Continue rendering user-generated content using React's default escaping.

Avoid using:

dangerouslySetInnerHTML

unless content is sanitized first.

# SEC-013 – SVG XSS Injection

## Objective

Verify that SVG-based JavaScript payloads are not executed.

---

## Test

Field:
Medical History

Payload:

<svg onload=alert(1)>

---

## Expected

- No JavaScript execution
- No popup
- SVG should not render
- Payload treated as plain text or safely escaped

---

## Actual Result

No popup appeared.

The application did not execute the payload.

No SVG content rendered.

The application safely handled the input.

---

## Severity

None

---

## Status

✅ PASS

# Input Validation

## SEC-021

### Test

Oversized Input Validation

### Field Tested

Patient Name

### Test Data

Approximately 1000 characters.

### Expected Result

The application should reject excessively long input with a validation error.

Example:

"Patient name cannot exceed 100 characters."

### Actual Result

The patient record was saved successfully.

### Risk

Although this does not directly expose patient data, accepting unlimited-length input may:

- Degrade application performance
- Cause UI rendering issues
- Produce malformed reports or invoices
- Increase storage requirements
- Reduce data quality

### Recommendation

Implement both client-side and server-side validation.

Suggested limits:

- Name: 100 characters
- Phone: 10–15 characters
- Email: 254 characters
- Address: 300 characters
- Medical History: 5000 characters
- Dental History: 5000 characters
- Allergies: 1000 characters

### Severity

Medium

### Status

FAIL

---

## SEC-022

### Test

Phone Number Validation

### Field

Patient Phone Number

### Test Payloads

ABCDEFGHIJ

123ABC456@

### Expected Result

Only valid phone numbers should be accepted.

Example:

- Digits only
- Length between 10 and 15 digits
- Optional leading '+' for international numbers

### Actual Result

The application accepted invalid values and created the patient successfully.

### Risk

Invalid phone numbers may:

- Prevent SMS delivery
- Prevent WhatsApp receipt delivery
- Reduce data quality
- Cause communication failures

### Recommendation

Validate both client-side and server-side.

Example validation:

- Required
- Digits only (or E.164 format)
- Minimum length: 10
- Maximum length: 15

### Severity

Medium

### Status

❌ FAIL

## SEC-023 – Required Field Validation

### Test

Attempted to create a patient without entering required contact information.

### Expected

The application should prevent saving until all required fields are completed.

### Actual

The application prevented the patient from being created when required fields were missing.

### Result

✅ PASS

### Notes

Required field validation for email and phone is working correctly.