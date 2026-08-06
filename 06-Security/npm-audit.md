
NPM REPORT BEFORE SECURITY AUDIT 
---------------------------------

$ npm audit
# npm audit report

@babel/core  <=7.29.0
@babel/core: Arbitrary File Read via sourceMappingURL Comment - https://github.com/advisories/GHSA-4x5r-pxfx-6jf8
fix available via `npm audit fix`
node_modules/@babel/core

brace-expansion  <=1.1.17 || 3.0.0 - 5.0.8
Severity: high
brace-expansion: Large numeric range defeats documented `max` DoS protection - https://github.com/advisories/GHSA-jxxr-4gwj-5jf2
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via exponential-time expansion of consecutive non-expanding {} groups - https://github.com/advisories/GHSA-3jxr-9vmj-r5cp
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded expansion length causing an out-of-memory process crash - https://github.com/advisories/GHSA-mh99-v99m-4gvg
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
brace-expansion: DoS via unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation - https://github.com/advisories/GHSA-rgw5-rvv9-x895
fix available via `npm audit fix`
node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion
node_modules/brace-expansion

js-yaml  4.0.0 - 4.2.0
Severity: high
JS-YAML: Quadratic-complexity DoS in merge key handling via repeated aliases - https://github.com/advisories/GHSA-h67p-54hq-rp68
js-yaml: YAML merge-key chains can force quadratic CPU consumption - https://github.com/advisories/GHSA-52cp-r559-cp3m
fix available via `npm audit fix`
node_modules/js-yaml

next  9.3.4-canary.0 - 16.3.0-preview.10
Severity: high
Next.js Vulnerable to Denial of Service with Server Components - https://github.com/advisories/GHSA-8h8q-6873-q5fj
Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up - https://github.com/advisories/GHSA-26hh-7cqf-hhc6
Next.js's Middleware / Proxy redirects can be cache-poisoned - https://github.com/advisories/GHSA-3g8h-86w9-wvmq
Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces - https://github.com/advisories/GHSA-ffhc-5mcf-pf4q
Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting - https://github.com/advisories/GHSA-vfv6-92ff-j949
Next.js has cross-site scripting in beforeInteractive scripts with untrusted input - https://github.com/advisories/GHSA-gx5p-jg67-6x7h
Next.js vulnerable to Denial of Service via connection exhaustion in applications using Cache Components - https://github.com/advisories/GHSA-mg66-mrh9-m8jx
Next.js has a Denial of Service in the Image Optimization API - https://github.com/advisories/GHSA-h64f-5h5j-jqjh
Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades - https://github.com/advisories/GHSA-c4j6-fc7j-m34r
Next.js has a Middleware / Proxy bypass through dynamic route parameter injection - https://github.com/advisories/GHSA-492v-c6pp-mqqv
Next.js vulnerable to cache poisoning in React Server Component responses - https://github.com/advisories/GHSA-wfc6-r584-vfw7
Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - https://github.com/advisories/GHSA-267c-6grr-h53f
Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n - https://github.com/advisories/GHSA-36qx-fr4f-26g5
Next.js: Middleware / Proxy bypass in App Router applications using Turbopack and single locale - https://github.com/advisories/GHSA-6gpp-xcg3-4w24
Next.js: Denial of Service in App Router using Server Actions - https://github.com/advisories/GHSA-m99w-x7hq-7vfj
Next.js: Server-Side Request Forgery in Server Actions on custom servers - https://github.com/advisories/GHSA-89xv-2m56-2m9x
Next.js: Cache confusion of response bodies for requests with bodies - https://github.com/advisories/GHSA-68g3-v927-f742
Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences - https://github.com/advisories/GHSA-4633-3j49-mh5q
Next.js: Unbounded Server Action payload in Edge runtime - https://github.com/advisories/GHSA-4c39-4ccg-62r3
Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname - https://github.com/advisories/GHSA-p9j2-gv94-2wf4
Next.js: Denial of Service in the Image Optimization API using SVGs - https://github.com/advisories/GHSA-q8wf-6r8g-63ch
Next.js: Unauthenticated disclosure of internal Server Function endpoints - https://github.com/advisories/GHSA-955p-x3mx-jcvp
Depends on vulnerable versions of postcss
Depends on vulnerable versions of sharp
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/next

postcss  <=8.5.22
Severity: high
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments - https://github.com/advisories/GHSA-6g55-p6wh-862q
PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure - https://github.com/advisories/GHSA-r28c-9q8g-f849
PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset - https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/next/node_modules/postcss
node_modules/postcss

sharp  <0.35.0
Severity: high
sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591 - https://github.com/advisories/GHSA-f88m-g3jw-g9cj
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/sharp

6 vulnerabilities (1 low, 5 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:


NPM AUDIT REPORT -- AFTER SECURITY HARDENING 

Nandu Prasad@LAPTOP-HOO1551I MINGW64 ~/Desktop/dental-clinic-site/frontend (vee-care-frontend-update)
$ npm audit
# npm audit report

next  9.3.4-canary.0 - 16.3.0-preview.10
Severity: high
Next.js Vulnerable to Denial of Service with Server Components - https://github.com/advisories/GHSA-8h8q-6873-q5fj
Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - Incomplete Fix Follow-Up - https://github.com/advisories/GHSA-26hh-7cqf-hhc6
Next.js's Middleware / Proxy redirects can be cache-poisoned - https://github.com/advisories/GHSA-3g8h-86w9-wvmq
Next.js vulnerable to cross-site scripting in App Router applications using CSP nonces - https://github.com/advisories/GHSA-ffhc-5mcf-pf4q
Next.js vulnerable to cache poisoning via collisions in React Server Component cache-busting - https://github.com/advisories/GHSA-vfv6-92ff-j949
Next.js has cross-site scripting in beforeInteractive scripts with untrusted input - https://github.com/advisories/GHSA-gx5p-jg67-6x7h
Next.js vulnerable to Denial of Service via connection exhaustion in applications using Cache Components - https://github.com/advisories/GHSA-mg66-mrh9-m8jx
Next.js has a Denial of Service in the Image Optimization API - https://github.com/advisories/GHSA-h64f-5h5j-jqjh
Next.js vulnerable to server-side request forgery in applications using WebSocket upgrades - https://github.com/advisories/GHSA-c4j6-fc7j-m34r
Next.js has a Middleware / Proxy bypass through dynamic route parameter injection - https://github.com/advisories/GHSA-492v-c6pp-mqqv
Next.js vulnerable to cache poisoning in React Server Component responses - https://github.com/advisories/GHSA-wfc6-r584-vfw7
Next.js has a Middleware / Proxy bypass in App Router applications via segment-prefetch routes - https://github.com/advisories/GHSA-267c-6grr-h53f
Next.js has a Middleware / Proxy bypass in Pages Router applications using i18n - https://github.com/advisories/GHSA-36qx-fr4f-26g5
Next.js: Middleware / Proxy bypass in App Router applications using Turbopack and single locale - https://github.com/advisories/GHSA-6gpp-xcg3-4w24
Next.js: Denial of Service in App Router using Server Actions - https://github.com/advisories/GHSA-m99w-x7hq-7vfj
Next.js: Server-Side Request Forgery in Server Actions on custom servers - https://github.com/advisories/GHSA-89xv-2m56-2m9x
Next.js: Cache confusion of response bodies for requests with bodies - https://github.com/advisories/GHSA-68g3-v927-f742
Next.js: Cache confusion of response bodies for requests with bodies containing invalid UTF-8 byte sequences - https://github.com/advisories/GHSA-4633-3j49-mh5q
Next.js: Unbounded Server Action payload in Edge runtime - https://github.com/advisories/GHSA-4c39-4ccg-62r3
Next.js: Server-Side Request Forgery in rewrites via attacker-controlled destination hostname - https://github.com/advisories/GHSA-p9j2-gv94-2wf4
Next.js: Denial of Service in the Image Optimization API using SVGs - https://github.com/advisories/GHSA-q8wf-6r8g-63ch
Next.js: Unauthenticated disclosure of internal Server Function endpoints - https://github.com/advisories/GHSA-955p-x3mx-jcvp
Depends on vulnerable versions of postcss
Depends on vulnerable versions of sharp
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/next

postcss  <=8.5.22
Severity: high
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments - https://github.com/advisories/GHSA-6g55-p6wh-862q
PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure - https://github.com/advisories/GHSA-r28c-9q8g-f849
PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset - https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/next/node_modules/postcss

sharp  <0.35.0
Severity: high
sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591 - https://github.com/advisories/GHSA-f88m-g3jw-g9cj
fix available via `npm audit fix --force`
Will install next@16.3.0, which is outside the stated dependency range
node_modules/sharp

3 high severity vulnerabilities

To address all issues, run:
  npm audit fix --force

Nandu Prasad@LAPTOP-HOO1551I MINGW64 ~/Desktop/dental-clinic-site/frontend (vee-care-frontend-update)


note:--

Dependency Security Review

Automated dependency scanning identified framework-level advisories affecting the installed Next.js release and bundled dependencies (PostCSS and Sharp). These advisories require evaluation against the application's actual feature usage before deciding on a framework upgrade. A forced upgrade was intentionally deferred to avoid introducing regressions before release.

