# Agro Hub — Migration Changes from AgriTrade Africa

## Summary
Complete transformation from a dual-sector (agriculture + electronics) Africa-only
platform to a global agriculture-only marketplace named **Agro Hub**.

---

## Files Changed

### Core Config
| File | Change |
|------|--------|
| `package.json` | Renamed `@agritrade/web` → `@agrohub/web`. Added `@paypal/react-paypal-js`. |
| `.env.local.example` | Added PayPal, Stripe env vars. Updated all references. |

### Constants (`src/lib/constants.ts`) — MAJOR REWRITE
- `APP_NAME` → `'Agro Hub'`
- `APP_DESCRIPTION` → global agriculture focus
- `CURRENCIES` expanded from 8 → 31 global currencies
- `AFRICAN_COUNTRIES` → replaced with `WORLD_COUNTRIES` (100+ countries). `AFRICAN_COUNTRIES` kept as alias for backward compat.
- Electronics subcategories → empty (`ELECTRONICS_SUBCATEGORIES = []`)
- New exports:
  - `AGRO_SECTORS` — 15 top-level agricultural sectors
  - `CASH_CROPS` — 15 cash crops
  - `FOOD_CROPS` — 20 food crops
  - `VEGETABLES` — 20 vegetables
  - `FRUITS` — 17 fruits
  - `LIVESTOCK_TYPES` — 15 animal types
  - `LIVESTOCK_PRODUCT_TYPES` — 10 livestock product subtypes
  - `FISH_TYPES` — 16 fish/aquaculture types
  - `FISH_PRODUCT_TYPES` — 9 fish product subtypes
  - `COFFEE_TYPES` — 12 coffee & beverage types
  - `SPICES` — 13 spice types
  - `CROP_PRODUCT_TYPES` — 9 subtypes (seeds, pesticide, fungicide, herbicide, fertilizer, fresh produce, dried/processed, expert service, equipment)
  - `PAYMENT_METHODS` — 5 global payment options
  - `SHIPPING_TYPES` — 4 shipping options (B2B bulk, B2C courier, local, pickup)
  - Updated `NAV_LINKS` — cash-crops, food-crops, livestock, fisheries, coffee

### Types (`src/types/database.ts`) — UPDATED
- `ProductCategory` — replaces `'agriculture' | 'electronics'` with 15 agriculture sectors
- Added `ProductSubType` — all possible product subtypes across sectors
- Added `trade_type: 'b2b' | 'b2c' | 'both'` to `Product`
- Added `product_type: ProductSubType` to `Product`

### Pages — NEW / UPDATED
| File | Change |
|------|--------|
| `src/app/page.tsx` | Hero updated. Electronics section removed. Agro sectors grid added. B2B/B2C callout section added. |
| `src/app/layout.tsx` | Updated metadata keywords. |
| `src/app/(marketplace)/sector/[sector]/page.tsx` | **NEW** — Sector overview with crop/animal grid |
| `src/app/(marketplace)/sector/[sector]/[crop]/page.tsx` | **NEW** — Full crop/animal detail page with product type filter + country filter + seller CTA |
| `src/app/(marketplace)/cash-crops/page.tsx` | Redirect to `/sector/cash_crops` |
| `src/app/(marketplace)/food-crops/page.tsx` | Redirect to `/sector/food_crops` |
| `src/app/(marketplace)/livestock/page.tsx` | Redirect to `/sector/livestock` |
| `src/app/(marketplace)/fisheries/page.tsx` | Redirect to `/sector/fisheries` |
| `src/app/(marketplace)/coffee/page.tsx` | Redirect to `/sector/coffee_beverages` |
| `src/app/(marketplace)/checkout/page.tsx` | Global countries. 5 payment methods (card, PayPal, mobile money, bank transfer, crypto). 4 shipping types. Order notes field. |
| `src/app/(dashboard)/listings/new/page.tsx` | Full rewrite — sector → crop/animal → product_type drill-down. Global countries + currencies. Trade type selector. |
| `src/app/(dashboard)/listings/page.tsx` | Agriculture sector icon instead of electronics icon. |
| `src/app/(dashboard)/dashboard/page.tsx` | "Browse Marketplace" updated. No electronics references. |
| `src/app/(dashboard)/profile/page.tsx` | `WORLD_COUNTRIES` instead of `AFRICAN_COUNTRIES`. |
| `src/app/loading.tsx` | Agro Hub branding. |
| `src/app/not-found.tsx` | 🌾 icon, Agro Hub copy. |

### Components — UPDATED
| File | Change |
|------|--------|
| `src/components/layout/header.tsx` | 🌿 logo icon. `Agro Hub` name. Updated nav. |
| `src/components/layout/footer.tsx` | Added sector links. Removed electronics. Global payment icons. |
| `src/components/layout/mobile-nav.tsx` | Agro Hub branding. |
| `src/components/marketplace/category-filter.tsx` | Agriculture subcategories only. Added sector pills. |
| `src/components/marketplace/product-card.tsx` | Shows agro sector icon. No electronics check. B2B/B2C badge. |
| `src/components/marketplace/products-page-client.tsx` | Added sector filter, product_type filter, country filter, trade_type filter with active filter badges. |
| `src/components/auth/register-form.tsx` | `WORLD_COUNTRIES`. Copy updated to "global marketplace". |
| `src/components/auth/login-form.tsx` | "Agro Hub account" copy. |
| `src/components/shipping/shipping-calculator.tsx` | `WORLD_COUNTRIES` (global). |

### Lib
| File | Change |
|------|--------|
| `src/lib/utils.ts` | `generateOrderNumber` prefix `AH-`. `formatCurrency` zero-decimal for JPY/UGX/IDR/VND/RWF. |
| `src/lib/ai/claude.ts` | System prompt updated to Agro Hub. `generateProductDescription` includes `subcategory` + `product_type`. |

---

## Database Migration Notes

You need to run migrations in Supabase to support the new schema:

```sql
-- 1. Update the category ENUM (or use text if not using enum)
-- Replace 'agriculture' | 'electronics' with the 15 agro sectors

-- 2. Add new columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS trade_type TEXT DEFAULT 'both' CHECK (trade_type IN ('b2b', 'b2c', 'both'));

-- 3. Migrate existing rows
UPDATE products SET product_type = 'produce_fresh' WHERE product_type IS NULL AND category = 'agriculture';
UPDATE products SET trade_type = 'both' WHERE trade_type IS NULL;

-- 4. Remove electronics products (optional)
-- DELETE FROM products WHERE category = 'electronics';
```

---

## New URL Structure

```
/                               Homepage (global agro marketplace)
/products                       All products (filterable)
/cash-crops                     → redirects to /sector/cash_crops
/food-crops                     → redirects to /sector/food_crops
/livestock                      → redirects to /sector/livestock
/fisheries                      → redirects to /sector/fisheries
/coffee                         → redirects to /sector/coffee_beverages
/sector/:sector                 Sector overview (crop/animal grid)
/sector/:sector/:crop           Full crop/animal detail page
                                  - Filter by: seeds | pesticide | fungicide |
                                    herbicide | fertilizer | fresh produce |
                                    expert service | equipment
                                  - Filter by: source country
                                  - Seller CTA form
/products/:id                   Individual product detail
/listings/new?sector=X&subcategory=Y  New listing (pre-fills sector/crop)
```

---

## Payment Methods Now Supported
1. **Credit / Debit Card** — Flutterwave (Africa) + Stripe (global)
2. **PayPal** — Global B2C
3. **Mobile Money** — MTN MoMo, Airtel, M-Pesa
4. **Bank Transfer / SWIFT** — B2B large orders
5. **Crypto** — USDT/BTC via Binance Pay

## Shipping Types Now Supported
1. **B2B Bulk Freight** — Container / LCL for large orders
2. **B2C Express Courier** — DHL, FedEx, UPS retail
3. **Local / Domestic** — Within-country
4. **Pickup at Farm/Warehouse** — Buyer collects
