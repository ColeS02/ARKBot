require('dotenv').config({ config: '../.env' });

const Arkbot = require('./client');
let client = new Arkbot();
client.start();