# API endpoint reference

All seven APIs share one Render base URL. Each service has its own route prefix. Every service supports `GET /<prefix>/health`, `GET /<prefix>/locations`, and the resource routes below. Common filters include `locationId`, `limit`, and `offset`; date-capable endpoints support `startDate` and `endDate.

## meta-ads

- `GET /meta-ads/accounts`
- `GET /meta-ads/campaigns`
- `GET /meta-ads/adsets`
- `GET /meta-ads/ads`
- `GET /meta-ads/insights`
- `GET /meta-ads/creatives`
- `GET /meta-ads/audiences`

## xero

- `GET /xero/organisations`
- `GET /xero/contacts`
- `GET /xero/invoices`
- `GET /xero/credit-notes`
- `GET /xero/payments`
- `GET /xero/bank-transactions`
- `GET /xero/accounts`
- `GET /xero/tracking-categories`
- `GET /xero/reports/profit-and-loss`
- `GET /xero/reports/balance-sheet`
- `GET /xero/reports/trial-balance`

## sunday

- `GET /sunday/locations`
- `GET /sunday/bills`
- `GET /sunday/payments`
- `GET /sunday/refunds`
- `GET /sunday/tips`
- `GET /sunday/transactions`
- `GET /sunday/reports/daily`

## easilys

- `GET /easilys/locations`
- `GET /easilys/products`
- `GET /easilys/inventory`
- `GET /easilys/stock-movements`
- `GET /easilys/suppliers`
- `GET /easilys/purchase-orders`
- `GET /easilys/deliveries`
- `GET /easilys/recipes`
- `GET /easilys/recipe-ingredients`
- `GET /easilys/waste`
- `GET /easilys/reports/food-cost`

## fourth-hospitality

- `GET /fourth-hospitality/locations`
- `GET /fourth-hospitality/employees`
- `GET /fourth-hospitality/employment`
- `GET /fourth-hospitality/departments`
- `GET /fourth-hospitality/roles`
- `GET /fourth-hospitality/shifts`
- `GET /fourth-hospitality/timesheets`
- `GET /fourth-hospitality/time-attendance`
- `GET /fourth-hospitality/absences`
- `GET /fourth-hospitality/labour-costs`
- `GET /fourth-hospitality/reports/labour`

## lightspeed

- `GET /lightspeed/locations`
- `GET /lightspeed/products`
- `GET /lightspeed/categories`
- `GET /lightspeed/sales`
- `GET /lightspeed/orders`
- `GET /lightspeed/payments`
- `GET /lightspeed/receipts`
- `GET /lightspeed/employees`
- `GET /lightspeed/registers`
- `GET /lightspeed/tax-rates`
- `GET /lightspeed/reports/sales`

## sevenrooms

- `GET /sevenrooms/locations`
- `GET /sevenrooms/reservations`
- `GET /sevenrooms/guests`
- `GET /sevenrooms/tables`
- `GET /sevenrooms/shifts`
- `GET /sevenrooms/waitlist`
- `GET /sevenrooms/events`
- `GET /sevenrooms/floorplans`
- `GET /sevenrooms/experiences`
- `GET /sevenrooms/guest-notes`
