const request = require('request')
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const baseurl = "https://localhost:8765/energy/api";

const home_path = process.env['HOME'];

const PRODUCTION_TYPES = [
  'AC Link',
  'Biomass',
  'DC Link',
  'Fossil Brown coal/Lignite',
  'Fossil Coal-derived gas',
  'Fossil Gas',
  'Fossil Hard coal',
  'Fossil Oil',
  'Fossil Oil shale',
  'Fossil Peat',
  'Geothermal',
  'Hydro Pumped Storage',
  'Hydro Run-of-river and poundage',
  'Hydro Water Reservoir',
  'Marine',
  'Nuclear',
  'Other',
  'Other renewable',
  'ProductionTypeText',
  'Solar',
  'Substation',
  'Transformer',
  'Waste',
  'Wind Offshore',
  'Wind Onshore'
];

const AREA_NAMES = [
  '50Hertz CA',
  'APG CA',
  'AST BZ',
  'AST CA',
  'Amprion CA',
  'AreaName',
  'Austria',
  'Belgium',
  'Bosnia Herzegovina',
  'Bulgaria',
  'CEPS BZ',
  'CEPS CA',
  'CGES BZ',
  'CGES CA',
  'CREOS CA',
  'Croatia',
  'Cyprus',
  'Cyprus TSO BZ',
  'Cyprus TSO CA',
  'Czech Republic',
  'DE-AT-LU',
  'DK1  BZ',
  'DK2 BZ',
  'Denmark',
  'ELES BZ',
  'ELES CA',
  'EMS BZ',
  'EMS CA',
  'ESO BZ',
  'ESO CA',
  'EirGrid CA',
  'Elering BZ',
  'Elering CA',
  'Elia BZ',
  'Elia CA',
  'Energinet CA',
  'Estonia',
  'Fingrid BZ',
  'Fingrid CA',
  'Finland',
  'Former Yugoslav Republic of Macedonia',
  'France',
  'Germany',
  'Greece',
  'HOPS BZ',
  'HOPS CA',
  'Hungary',
  'IPTO BZ',
  'IPTO CA',
  'IT-Centre-North BZ',
  'IT-Centre-South BZ',
  'IT-North BZ',
  'IT-Sardinia BZ',
  'IT-Sicily BZ',
  'IT-South BZ',
  'Ireland',
  'Italy',
  'Italy CA',
  'Latvia',
  'Litgrid BZ',
  'Litgrid CA',
  'Lithuania',
  'Luxembourg',
  'MAVIR BZ',
  'MAVIR CA',
  'MEPSO BZ',
  'MEPSO CA',
  'Montenegro',
  'NO1 BZ',
  'NO2 BZ',
  'NO3 BZ',
  'NO4 BZ',
  'NO5 BZ',
  'NOS BiH BZ',
  'NOS BiH CA',
  'National Grid BZ',
  'National Grid CA',
  'Netherlands',
  'Norway',
  'PSE SA BZ',
  'PSE SA CA',
  'Poland',
  'Portugal',
  'REE BZ',
  'REE CA',
  'REN BZ',
  'REN CA',
  'RTE BZ',
  'RTE CA',
  'Romania',
  'SE1 BZ',
  'SE2 BZ',
  'SE3 BZ',
  'SE4 BZ',
  'SEPS BZ',
  'SEPS CA',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Statnett CA',
  'SvK CA',
  'Sweden',
  'Switzerland',
  'TenneT GER CA',
  'TenneT NL BZ',
  'TenneT NL CA',
  'Transelectrica BZ',
  'Transelectrica CA',
  'TransnetBW CA',
  'Ukraine',
  'Ukraine BEI CA',
  'Ukraine BZN',
  'Ukraine IPS CA',
  'swissgrid BZ',
  'swissgrid CA'
]

const TIME_RESOLUTIONS = [
  'PT15M',
  'PT60M',
  'PT30M',
  'P7D',
  'P1M',
  'P1Y',
  'P1D',
  'CONTRACT'
]

function readTokenFromFile() {
  currentTokenString = fs.readFileSync(home_path + '/softeng19bAPI.token', 'utf8');
  currentToken = JSON.parse(currentTokenString);
  return currentToken.token
}

function validateAreaName (area) {
  return AREA_NAMES.includes(area);
}

function validateTimeResolution (timeres) {
  return TIME_RESOLUTIONS.includes(timeres);
}

function validateProductionType (type) {
  return PRODUCTION_TYPES.includes(type);
}

function validateFormat (format) {
  return format === 'json' || format === 'csv' ;
}

function validateDate (date) {
  return /([12]\d{3}-((0[1-9]|[1-9])|1[0-2])-((0[1-9]|[1-9])|[12]\d|3[01]))/.test(date)
}

function validateYearAndMonth (yearAndMonth) {
  return /([12]\d{3}-((0[1-9]|[1-9])|1[0-2]))/.test(yearAndMonth)
}

function validateYear (year) {
  return /([12]\d{3})/.test(year)
}

function cropFrontZero(value) {
  if (value.charAt(0) === '0') {
    value = value.substr(1);
  }
  return value;
}

function validateApiKey (apikey) {
  var groups = apikey.split('-');
  if (groups.length != 3) {
    console.log('Invalid API KEY format. Valid format is XXXX-XXXX-XXXX, where X is an alphanumeric char.')
    return false;
  }

  var flag = true;
  groups.forEach(group => {
    if (/^[a-zA-Z0-9]{4}/.test(group) !== true) {
      flag = false;
    }
  })
  return flag;
}

function validateAlphanumeric (input) {
  if( input.match("^[a-zA-Z0-9]*$")){
    return true;
  } else {
    return false
  }
}

function validateNumber (num) {
  var isnum = /^\d+$/.test(num);
  return isnum;
}


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const reset = () => {
  request({
    url: baseurl + "/Reset",
    method: "POST",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.error(error)
    }
    console.log(response.statusCode)
    console.log(reponse.body)
  })
}

const healthCheck = () => {
  request({
    url: baseurl + "/HealthCheck",
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.error(error)
    }
    console.log(response.statusCode)
    console.log(response.body)
  })
}

const login = (un, pw) => {
  isvalid = validateAlphanumeric(un);
  if (!isvalid) {
    console.log("Username must only contain letters a-z or A-Z or numbers 0-9")
    return;
  }
  request({
    url: baseurl + "/Login",
    body: {username: un, password: pw},
    method: "POST",
    json: true
  }, (error, response, body) => {
    if (error) { console.log(error) }
    console.log(response.statusCode)
  })
  .pipe(fs.createWriteStream(home_path + '/softeng19bAPI.token'))
}

const logout = () => {
  token = readTokenFromFile();

  request({
    url: baseurl + "/Logout",
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "POST",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log(error)
    } else if (response.statusCode == 200) {
      fs.writeFileSync(home_path + '/softeng19bAPI.token', '', () => {
        console.log('Logged out succesfully')
      })
      console.log('Logged out succesfully')
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualTotalLoadByDay = (area, timeres, date, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateDate(date)
  if (!isvalid) {
    console.log('Invalid date format. Example of valid date format  <YYYY-MM-DD>, where YYYY for year, MM for month, DD for day.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }
  token = readTokenFromFile();

  console.log(date.split('-')[0], date.split('-')[1], date.split('-')[2])
  const myDate = `${date.split('-')[0]}-${cropFrontZero(date.split('-')[1])}-${cropFrontZero(date.split('-')[2])}`;


  request({
    url: baseurl + "/ActualTotalLoad/" + area + "/" + timeres + "/date/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualTotalLoadByMonth = (area, timeres, yearAndMonth, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYearAndMonth(yearAndMonth)
  if (!isvalid) {
    console.log('Invalid year and month format. Example of valid format  <YYYY-MM>, where YYYY for year, MM for month.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${yearAndMonth.split('-')[0]}-${cropFrontZero(yearAndMonth.split('-')[1])}`;

  request({
    url: baseurl + "/ActualTotalLoad/" + area + "/" + timeres + "/month/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualTotalLoadByYear = (area, timeres, year, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYear(year)
  if (!isvalid) {
    console.log('Invalid year format. Example of valid year format  <YYYY>, where YYYY for year (4 digits).')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }
  token = readTokenFromFile();

  request({
    url: baseurl + "/ActualTotalLoad/" + area + "/" + timeres + "/year/" + year + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const aggregatedGenerationPerTypeByDay = (area, timeres, type, date, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateProductionType(type)
  if (!isvalid) {
    console.log('Invalid production type');
    return;
  }
  isvalid = validateDate(date)
  if (!isvalid) {
    console.log('Invalid date format. Example of valid date format  <YYYY-MM-DD>, where YYYY for year, MM for month, DD for day.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${date.split('-')[0]}-${cropFrontZero(date.split('-')[1])}-${cropFrontZero(date.split('-')[2])}`;

  request({
    url: baseurl + "/AggregatedGenerationPerType/" + area + "/" + type + "/" + timeres + "/date/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const aggregatedGenerationPerTypeByMonth = (area, timeres, type, yearAndMonth, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateProductionType(type)
  if (!isvalid) {
    console.log('Invalid production type');
    return;
  }
  isvalid = validateYearAndMonth(yearAndMonth)
  if (!isvalid) {
    console.log('Invalid year and month format. Example of valid format  <YYYY-MM>, where YYYY for year, MM for month.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${yearAndMonth.split('-')[0]}-${cropFrontZero(yearAndMonth.split('-')[1])}`;

  request({
    url: baseurl + "/AggregatedGenerationPerType/" + area + "/" + type + "/" + timeres + "/month/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const aggregatedGenerationPerTypeByYear= (area, timeres, type, year, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateProductionType(type)
  if (!isvalid) {
    console.log('Invalid production type');
    return;
  }
  isvalid = validateYear(year)
  if (!isvalid) {
    console.log('Invalid year format. Example of valid year format  <YYYY>, where YYYY for year (4 digits).')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  request({
    url: baseurl + "/AggregatedGenerationPerType/" + area + "/" + type + "/" + timeres + "/year/" + year + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const forecastTotalLoadByDay = (area, timeres, date, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateDate(date)
  if (!isvalid) {
    console.log('Invalid date format. Example of valid date format  <YYYY-MM-DD>, where YYYY for year, MM for month, DD for day.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${date.split('-')[0]}-${cropFrontZero(date.split('-')[1])}-${cropFrontZero(date.split('-')[2])}`;

  request({
    url: baseurl + "/DayAheadTotalLoadForecast/" + area + "/" + timeres + "/date/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const forecastTotalLoadByMonth = (area, timeres, yearAndMonth, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYearAndMonth(yearAndMonth)
  if (!isvalid) {
    console.log('Invalid year and month format. Example of valid format  <YYYY-MM>, where YYYY for year, MM for month.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${yearAndMonth.split('-')[0]}-${cropFrontZero(yearAndMonth.split('-')[1])}`;

  request({
    url: baseurl + "/DayAheadTotalLoadForecast/" + area + "/" + timeres + "/month/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const forecastTotalLoadByYear = (area, timeres, year, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYear(year)
  if (!isvalid) {
    console.log('Invalid year format. Example of valid year format  <YYYY>, where YYYY for year (4 digits).')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  request({
    url: baseurl + "/DayAheadTotalLoadForecast/" + area + "/" + timeres + "/year/" + year + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualVsForecastByDay = (area, timeres, date, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateDate(date)
  if (!isvalid) {
    console.log('Invalid date format. Example of valid date format  <YYYY-MM-DD>, where YYYY for year, MM for month, DD for day.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${date.split('-')[0]}-${cropFrontZero(date.split('-')[1])}-${cropFrontZero(date.split('-')[2])}`;

  request({
    url: baseurl + "/ActualvsForecast/" + area + "/" + timeres + "/date/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualVsForecastByMonth = (area, timeres, yearAndMonth, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYearAndMonth(yearAndMonth)
  if (!isvalid) {
    console.log('Invalid year and month format. Example of valid format  <YYYY-MM>, where YYYY for year, MM for month.')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  const myDate = `${yearAndMonth.split('-')[0]}-${cropFrontZero(yearAndMonth.split('-')[1])}`;

  request({
    url: baseurl + "/DayAheadTotalLoadForecast/" + area + "/" + timeres + "/month/" + myDate + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const actualVsForecastByYear = (area, timeres, year, format) => {
  var isvalid = validateAreaName(area);
  if (!isvalid) {
    console.log('Invalid area name')
    return;
  }
  isvalid = validateTimeResolution(timeres)
  if (!isvalid) {
    console.log('Invalid time resolution');
    return;
  }
  isvalid = validateYear(year)
  if (!isvalid) {
    console.log('Invalid year format. Example of valid year format  <YYYY>, where YYYY for year (4 digits).')
    return;
  }
  isvalid = validateFormat(format)
  if (!isvalid) {
    console.log('Invalid file format. Valid formats: json | csv.')
    return;
  }

  token = readTokenFromFile();

  request({
    url: baseurl + "/DayAheadTotalLoadForecast/" + area + "/" + timeres + "/year/" + year + "?format=" + format,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const adminNewUser = (un, pw, em, q) => {
  var isvalid = validateAlphanumeric(un);
  if (!isvalid) {
    console.log("Username must only contain letters a-z or A-Z or numbers 0-9")
    return;
  }

  isvalid = validateEmail(em)
  if (!isvalid) {
    console.log("Invalid email format")
    return;
  }

  isvalid = validateNumber(q)
  if (!isvalid) {
    console.log("Quota is invalid. Quota must be of number type")
    return;
  }
  token = readTokenFromFile();

  request({
    url: baseurl + "/Admin/users",
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    body: {
      username: un,
      password: pw,
      email: em,
      quota: q
    },
    method: "POST",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const adminModUser = (un, pw, em, q) => {
  var isvalid = validateAlphanumeric(un);
  if (!isvalid) {
    console.log("Username must only contain letters a-z or A-Z or numbers 0-9")
    return;
  }

  isvalid = validateEmail(em)
  if (!isvalid) {
    console.log("Invalid email format")
    return;
  }

  isvalid = validateNumber(q)
  if (!isvalid) {
    console.log("Quota is invalid. Quota must be of number type")
    return;
  }

  token = readTokenFromFile();

  request({
    url: baseurl + "/Admin/users/" + un,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    body: {
      password: pw,
      email: em,
      quota: q
    },
    method: "PUT",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const adminUserStatus = (un) => {
  unvalid = validateAlphanumeric(un);
  if (!unvalid) {
    console.log("Username must only contain letters a-z or A-Z or numbers 0-9")
    return;
  }

  token = readTokenFromFile();

  request({
    url: baseurl + "/Admin/users/" + un,
    headers: {
      "X-OBSERVATORY-AUTH": "Bearer " + token
    },
    method: "GET",
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log('Error')
      console.log(error)
    } else if (response.statusCode == 200) {
      console.log(response.body)
    } else {
      console.log(response.statusCode + '\n' + response.body)
    }
  })
}

const adminNewData = (data, file) => {
  token = readTokenFromFile();

  formData = {
    file: fs.createReadStream(file)
  }

  request.post(
    {
      url: baseurl + "/Admin/" + data,
      headers: {
        "X-OBSERVATORY-AUTH": "Bearer " + token,
        "Content-Type": "multipart/form-data"
      },
      formData: formData,
    }, (error, response, body) => {
      if (error) {
        console.log('Error')
        console.log(error)
      } else if (response.statusCode == 200) {
        console.log(response.body)
      } else {
        console.log(response.statusCode + '\n' + response.body)
      }
    }
  )
}

module.exports = {
  reset,
  healthCheck,
  login,
  logout,
  actualTotalLoadByDay,
  actualTotalLoadByMonth,
  actualTotalLoadByYear,
  aggregatedGenerationPerTypeByDay,
  aggregatedGenerationPerTypeByMonth,
  aggregatedGenerationPerTypeByYear,
  forecastTotalLoadByDay,
  forecastTotalLoadByMonth,
  forecastTotalLoadByYear,
  actualVsForecastByDay,
  actualVsForecastByMonth,
  actualVsForecastByYear,
  adminNewUser,
  adminModUser,
  adminUserStatus,
  adminNewData
}
