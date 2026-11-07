# Restaurant Group — Seven Mock APIs, One Render Service

This combined project runs all seven mock APIs from **one Render Web Service**. Each API keeps its own route prefix, health endpoint, location endpoint, generated data, and filters. The APIs are logically separate, but share one host and one deployment.

## API prefixes

- `/meta-ads`
- `/xero`
- `/sunday`
- `/easilys`
- `/fourth-hospitality`
- `/lightspeed`
- `/sevenrooms`

See [`API-ENDPOINTS.md`](API-ENDPOINTS.md) for every resource endpoint.

## Example requests

Replace `https://YOUR-SERVICE.onrender.com` with the URL Render gives you:

```text
GET https://YOUR-SERVICE.onrender.com/health
GET https://YOUR-SERVICE.onrender.com/meta-ads/health
GET https://YOUR-SERVICE.onrender.com/meta-ads/campaigns?locationId=uk-ave-mario
GET https://YOUR-SERVICE.onrender.com/xero/invoices?limit=20&offset=0
GET https://YOUR-SERVICE.onrender.com/sunday/bills?locationId=uk-ave-mario
GET https://YOUR-SERVICE.onrender.com/easilys/inventory?locationId=uk-ave-mario
GET https://YOUR-SERVICE.onrender.com/fourth-hospitality/shifts?locationId=uk-ave-mario
GET https://YOUR-SERVICE.onrender.com/lightspeed/sales?locationId=uk-ave-mario
GET https://YOUR-SERVICE.onrender.com/sevenrooms/reservations?locationId=uk-ave-mario
```

## Deploy to Render (one service)

1. Extract this ZIP and push the **contents of this project folder** to one GitHub repository.
2. In Render, choose **New → Web Service** and connect that repository.
3. Use the repository root as the Root Directory (leave it blank if the project files are at the repository root).
4. Runtime: **Node**. Build command: `npm install`. Start command: `npm start`.
5. Create the service. Render supplies one base URL; append the route prefixes above.
6. Verify `https://YOUR-SERVICE.onrender.com/health` and each `/<prefix>/health` endpoint.

A `render.yaml` is included if you prefer Render Blueprint deployment.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm test
npm start
```

Then open `http://localhost:3000/health`.

## Common query parameters

Most collection endpoints support `locationId`, `limit` (default 100, max 1000), and `offset`. Date-based datasets support `startDate` and `endDate`. Individual APIs may support additional filters; see the service README files and endpoint data.

## Important notes

- This is mock data for integration and development testing, not a live connection to Meta, Xero, Sunday, Easilys/MAPAL, Fourth, Lightspeed, or SevenRooms.
- One Render web service means one hostname with seven distinct route namespaces. It does not create seven independent hostnames/services.
- The shared dataset contains the 44 restaurant locations supplied for this project. Some location IDs are stable generated slugs; `uk-ave-mario` is retained. Confirm vendor-specific IDs before connecting to production systems.
- Vendor schemas are representative mock schemas, not certified copies of private vendor API specifications.


### Deployment memory note
The API generates each resource dataset on first request and caches it for subsequent requests. This avoids generating every API dataset during process startup. Use a Node.js 20 or 22 runtime.
