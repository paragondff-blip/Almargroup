# Security Specification

## 1. Data Invariants
- Products, News, Jobs, Activities, Footer, Settings: Publicly readable; Admin only writable.
- Orders: Admin only read/write.
- Brands, Coupons: Admin only read/write.

## 2. The Dirty Dozen Payloads (Examples)
1. { "name": "Hack", "price": "100" } (Wrong type for price)
2. { "name": "", "price": 0 } (Missing name)
3. { "admin": true } (Ghost field injection in products)
4. { "status": "Shipped" } (Updating restricted fields in orders)
...

## 3. The Test Runner
To be implemented in firestore.rules.test.ts.
