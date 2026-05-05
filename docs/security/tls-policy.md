# TLS Policy

**Protocols:** TLS 1.2 and TLS 1.3 only. TLS 1.0 and 1.1 are disabled.

**Cipher suites:** Platform default secure ciphers (Azure App Service / Azure Container Apps). No custom cipher list is maintained; the platform's cipher selection is reviewed on each major OS upgrade.

**HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains` on every HTTPS response.

**HTTP listener:** Disabled in production. HTTP traffic is rejected at the load balancer; no plaintext path exists inside the VNet.

**Certificate management:** Azure-managed TLS certificates (auto-renewal). Expiry is monitored via Azure Monitor alerts.
