# File Upload Security Assessment

## Overview

The application does not upload binary files directly.

Instead, X-ray images are uploaded to Google Drive and only the image URL is stored in MongoDB.

---

## Architecture

Admin
      │
      ▼
Upload X-ray to Google Drive
      │
      ▼
Copy Shareable URL
      │
      ▼
Paste URL into Application
      │
      ▼
Application stores only the URL

---

## SEC-040

### Test

Direct File Upload

### Result

Not Applicable

### Finding

The application never receives uploaded files.

Images are hosted externally on Google Drive.

### Status

PASS

---

## SEC-041

### Test

Malicious File Upload (.exe, .php, .js)

### Result

Not Applicable

### Finding

Binary uploads are not accepted by the application.

### Status

PASS

---

## SEC-042

### Test

External URL Validation

### Test Performed

Entered various non-Google Drive URLs into the X-Ray URL field.

Examples:

https://google.com

https://example.com/image.jpg

javascript:alert(1)

Result

Application accepted every URL without validation.

Finding

The application currently accepts arbitrary URLs.

Potential Risks

• Broken image links
• Invalid image sources
• Possibility of future abuse if URLs are rendered insecurely
• Poor data quality

Recommendation

Validate URLs before saving.

Recommended Policy

Only allow trusted domains such as:

- drive.google.com
- lh3.googleusercontent.com

Reject:

- javascript:
- data:
- file:
- ftp:
- malformed URLs

Severity

Low

Status

FAIL