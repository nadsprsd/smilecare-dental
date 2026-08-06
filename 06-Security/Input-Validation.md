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