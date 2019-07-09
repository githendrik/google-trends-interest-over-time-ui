const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const trends = require('./src/api/trends');

const app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static(path.resolve(__dirname, 'dist/google-trends-interest-over-time-ui')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/getInterestOverTime', trends.getInterestOverTime);
app.get('/api/dummy', trends.getDummy);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
