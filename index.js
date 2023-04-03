const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

//have expresss use common morgan setup
app.use(morgan('common'));

//morgan log writing
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

