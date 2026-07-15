# Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations course.

**Custom object list view (developer test account):**
https://app.hubspot.com/contacts/<test-account-id>/objects/<custom-object-id>/views/all/list

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your private app access token:
   ```
   PRIVATE_APP_ACCESS_TOKEN=your-token-here
   CUSTOM_OBJECT_TYPE=your-object-type-id-or-name
   ```
3. `node index.js`
4. Open `http://localhost:3000`

## Routes

- `GET /` — retrieves all custom object records and displays them in a table.
- `GET /update-cobj` — renders a form to create a new record.
- `POST /update-cobj` — submits the form data to HubSpot and redirects to `/`.
