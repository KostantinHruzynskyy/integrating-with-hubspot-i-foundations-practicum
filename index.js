const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

// The custom object type identifier as it appears in the HubSpot API,
// e.g. "2-123456" (the object's typeId) or a custom name like "plants".
// Set this in your .env file once you've created the custom object.
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || 'plants';

// The list of custom property internal names to read/write on the object.
// "name" is required by the practicum; add your other two here to match
// whatever you set up in HubSpot.
const CUSTOM_PROPERTIES = ['name', 'species', 'watering_frequency'];

/**
 * Route 1: Homepage
 * GET request to retrieve all custom object records, then render them
 * in an HTML table via the homepage Pug template.
 */
app.get('/', async (req, res) => {
  const propertiesParam = CUSTOM_PROPERTIES.join(',');
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=${propertiesParam}`;

  try {
    const resp = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const records = resp.data.results;
    res.render('homepage', {
      title: 'Custom Object Homepage | Integrating With HubSpot I Practicum',
      records: records,
      properties: CUSTOM_PROPERTIES,
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error retrieving records from HubSpot.');
  }
});

/**
 * Route 2: Update form (GET)
 * Renders a Pug template with an HTML form for creating a new record.
 */
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    properties: CUSTOM_PROPERTIES,
  });
});

/**
 * Route 3: Update form (POST)
 * Takes the submitted form data, creates a new CRM record via the
 * HubSpot API, then redirects back to the homepage.
 */
app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  const properties = {};
  CUSTOM_PROPERTIES.forEach((prop) => {
    properties[prop] = req.body[prop];
  });

  try {
    await axios.post(
      url,
      { properties },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.redirect('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error creating record in HubSpot.');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
