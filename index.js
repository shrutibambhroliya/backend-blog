const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

const { parsed } = require('dotenv').config();

const { json } = require('express');
app.use(json());

const cors = require('cors');
app.use(cors());

require('./app/db/database')

app.use('/api', require('./app/api'))

app.listen(parsed.PORT, () => {
    console.log("1000 port started");
});