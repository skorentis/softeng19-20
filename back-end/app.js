require('./config/config');
require('./db/mongoose');
require('./middleware/quota_renew');
// require('./db/packet_import');
// require('./db/db_import');
//require('./db/create_admin');

const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const ActualTotalLoad_router = require('./routes/ActualTotalLoad.js');
const AggregatedGenerationPerType_router = require('./routes/AggregatedGenerationPerType.js');
const DayAheadTotalLoadForecast_router = require('./routes/DayAheadTotalLoadForecast.js');
const ActualvsForecast_router = require('./routes/ActualvsForecast.js');
const Admin_router = require('./routes/Admin.js');
const Login_Logout_router = require('./routes/Login_Logout.js');
const Additional_router = require('./routes/Additional.js');
const Billing_router = require('./routes/Billing.js');
const Get_Packets_router = require('./routes/Get_Packets.js');

var baseURL = process.env.baseURL;
var port = process.env.port;

var privateKey = fs.readFileSync('sslcert/privateKey.key', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-OBSERVATORY-AUTH"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(ActualTotalLoad_router);
app.use(AggregatedGenerationPerType_router);
app.use(DayAheadTotalLoadForecast_router);
app.use(ActualvsForecast_router);
app.use(Admin_router);
app.use(Login_Logout_router);
app.use(Additional_router);
app.use(Billing_router);
app.use(Get_Packets_router);

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server started up at port ${port}`);
});

module.exports = httpsServer ;
