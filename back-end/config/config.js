var env =  'development' || 'process.env.NODE_ENV';
//console.log(env);
if (env === 'development' || env === 'test') {
  // var config = require('./config.json.js');
  var config = require('./config.json');
  var envConfig = config[env];
  var env_sec = require('./env.json');

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });

  Object.keys(env_sec).forEach((key) => {
    process.env[key] = env_sec[key];
  });

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}