# 66 — Password Hashing Storage Proof

**Traces to:** L2-050. L1-014.

Vertical slice: passwords are stored only as ASP.NET Identity hashes (PBKDF2 with the framework defaults), never as plaintext or reversible ciphertext. Proven by tests.

## Components

- Backend Identity options in `Program.cs` keep defaults: `IdentityOptions.PasswordHasher` = `PasswordHasher<TUser>` (PBKDF2, 100k iterations as of .NET 8).
- Tests `tests/security/password-storage.spec.cs`:
  1. Register user with password `"P@ssw0rd!"` → assert `AspNetUsers.PasswordHash` row does not contain the password (raw or base64) and matches the PBKDF2 format prefix `AQAAAAEA...`.
  2. Change password → assert old hash differs from new hash.
  3. Scan request/response logs for the registration → assert the password substring is absent from any log entry.

## Acceptance tests (L2-050)

- Registered user's stored hash is non-reversible (length, format, no plaintext substring).
- Password change rotates the stored hash.
- Logs contain no password values.

## Radical simplicity notes

- Trust the framework default. Do not reinvent the hasher.
- Logging assertions are part of this slice because the storage guarantee is meaningless if logs leak.
