# T115 — Contact Detail: meta fields (email/phone/city) should use icons, not bold labels

**Status**: Fixed

## Description

The contact detail summary section shows email, phone, and city as `<strong>Label:</strong> value` text pairs.
The design uses Material Symbols icons (`mail`, `call`, `location_on`) next to each value with no text label.

**Current:**
```
Email: sarah@hopecity.org
Phone: +1 416 555 0117
City: Toronto
```

**Expected (design):**
```
✉ sarah@hopecity.org
📞 +1 416 555 0117
📍 Toronto
```

## Steps to reproduce

1. Navigate to `/contacts/:id`
2. Observe the summary section

## References
- Design: `Desktop / Contact Detail` — `s9kANa` (cdMeta) with rows `cdM1` (mail), `cdM2` (call), `cdM3` (location_on)
