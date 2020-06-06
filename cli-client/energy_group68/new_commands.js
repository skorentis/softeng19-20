#!/usr/bin/env node

const program = require('commander');

const {
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
} = require('./index');

program
  .name('energy_group68')
  .version('1.0.0')
  .description('ENTSOE Datasets Management CLI')

// program
//   .command('mytest')
//   .requiredOption('-o, --myoption <something>', 'varius options')
//   .action(options => {
//     mytesting(checkForExtraOptionArgs(options.myoption))
//   })

program
  .command('HealthCheck')
  .alias('health')
  .description('Do a health check')
  .action(() => {
    healthCheck();
  })

program
  .command('Reset')
  .alias('reset')
  .description('Reset database')
  .action(() => {
    reset();
  })

program
  .command('Login')
  .alias('login')
  .description('User login')
  .requiredOption('-u, --username <username>', 'User username')
  .requiredOption('-p, --password <password>', 'User password')
  .action(options => {
    login(options.username, options.password);
  })

program
  .command('Logout')
  .alias('logout')
  .description('User Logout')
  .action(() => {
    logout();
  })

program
  .command('ActualTotalLoad')
  .alias('actual')
  .description('Actual Total Load Dataset')
  .requiredOption('-a, --area <areaName>', 'Area Name')
  .requiredOption('-t, --timeres <timeResolution>', 'Time Resolution')
  .option('-d, --date <date>', 'Specify full date')
  .option('-m, --month <yearAndMonth>', 'Specify year and month, not the day')
  .option('-y, --year <year>', 'Specify just the year')
  .option('-f, --format <format>', 'File format (json | csv)', 'json')
  .action(options => {
    const selDate = options.date;
    const selMonth = options.month;
    const selYear = options.year;
    const selArea = checkForExtraOptionArgs(options.area);
    const selTimeRes = options.timeres;
    const selFormat = options.format;

    if (selDate !== undefined && selMonth === undefined && selYear == undefined) {
      actualTotalLoadByDay(selArea, selTimeRes, selDate, selFormat);
    } else if (selDate === undefined && selMonth !== undefined && selYear === undefined) {
      actualTotalLoadByMonth(selArea, selTimeRes, selMonth, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear !== undefined) {
      actualTotalLoadByYear(selArea, selTimeRes, selYear, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear === undefined) {
      const d = new Date();
      const day = d.getDate().toString();
      const month = (d.getMonth()+1).toString();
      const year = d.getFullYear().toString();
      const date = year + '-' + month + '-' + day;
      actualTotalLoadByDay(selArea, selTimeRes, date, selFormat);
    } else {
      console.log('Sorry, not more than one of the (--date, --month, --year) options can be submitted')
    }
  })

  program
  .command('AggregatedGenerationPerType')
  .alias('aggregen')
  .description('Aggregated Generation Per Type Dataset')
  .requiredOption('-a, --area <areaName>', 'Area Name')
  .requiredOption('-t, --timeres <timeResolution>', 'Time Resolution')
  .requiredOption('-p, --productiontype <productionType>', 'Production Type')
  .option('-d, --date <date>', 'Specify full date')
  .option('-m, --month <yearAndMonth>', 'Specify year and month, not the day')
  .option('-y, --year <year>', 'Specify just the year')
  .option('-f, --format <format>', 'File format (json | csv)', 'json')
  .action(options => {
    const selDate = options.date;
    const selMonth = options.month;
    const selYear = options.year;
    const selArea = checkForExtraOptionArgs(options.area);
    const selTimeRes = options.timeres;
    const selProdType = checkForExtraOptionArgs(options.productiontype);
    const selFormat = options.format;
    if (selDate !== undefined && selMonth === undefined && selYear === undefined) {
      aggregatedGenerationPerTypeByDay(selArea, selTimeRes, selProdType, selDate, selFormat);
    } else if (selDate === undefined && selMonth !== undefined && selYear === undefined) {
      aggregatedGenerationPerTypeByMonth(selArea, selTimeRes, selProdType, selMonth, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear !== undefined) {
      aggregatedGenerationPerTypeByYear(selArea, selTimeRes, selProdType, selYear, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear === undefined) {
      const d = new Date();
      const day = d.getDate().toString();
      const month = (d.getMonth()+1).toString();
      const year = d.getFullYear().toString();
      const date = year + '-' + month + '-' + day;
      aggregatedGenerationPerTypeByDay(selArea, selTimeRes, selProdType, date, selFormat);
    } else {
      console.log('Sorry, not more than one of the (--date, --month, --year) options can be submitted')
    }
  })

  program
  .command('DayAheadTotalLoadForecast')
  .alias('forecast')
  .description('Day Ahead Total Load Forecast Dataset')
  .requiredOption('-a, --area <areaName>', 'Area Name')
  .requiredOption('-t, --timeres <timeResolution>', 'Time Resolution')
  .option('-d, --date <date>', 'Specify full date')
  .option('-m, --month <yearAndMonth>', 'Specify year and month, not the day')
  .option('-y, --year <year>', 'Specify just the year')
  .option('-f, --format <format>', 'File format (json | csv)', 'json')
  .action(options => {
    const selDate = options.date;
    const selMonth = options.month;
    const selYear = options.year;
    const selArea = checkForExtraOptionArgs(options.area);
    const selTimeRes = options.timeres;
    const selFormat = options.format;

    if (selDate !== undefined && selMonth === undefined && selYear === undefined) {
      forecastTotalLoadByDay(selArea, selTimeRes, selDate, selFormat);
    } else if (selDate === undefined && selMonth !== undefined && selYear === undefined) {
      forecastTotalLoadByMonth(selArea, selTimeRes, selMonth, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear !== undefined) {
      forecastTotalLoadByYear(selArea, selTimeRes, selYear, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear === undefined) {
      const d = new Date();
      const day = d.getDate().toString();
      const month = (d.getMonth()+1).toString();
      const year = d.getFullYear().toString();
      const date = year + '-' + month + '-' + day;
      forecastTotalLoadByDay(selArea, selTimeRes, date, selFormat);
    } else {
      console.log('Sorry, not more than one of the (--date, --month, --year) options can be submitted')
    }
  })

  program
  .command('ActualvsForecast')
  .alias('actualvsforecast')
  .description('Actual vs Forecast Dataset')
  .requiredOption('-a, --area <areaName>', 'Area Name')
  .requiredOption('-t, --timeres <timeResolution>', 'Time Resolution')
  .option('-d, --date <date>', 'Specify full date')
  .option('-m, --month <yearAndMonth>', 'Specify year and month, not the day')
  .option('-y, --year <year>', 'Specify just the year')
  .option('-f, --format <format>', 'File format (json | csv)', 'json')
  .action(options => {
    const selDate = options.date;
    const selMonth = options.month;
    const selYear = options.year;
    const selArea = checkForExtraOptionArgs(options.area);
    const selTimeRes = options.timeres;
    const selFormat = options.format;

    if (selDate !== undefined && selMonth === undefined && selYear === undefined) {
      actualVsForecastByDay(selArea, selTimeRes, selDate, selFormat);
    } else if (selDate === undefined && selMonth !== undefined && selYear === undefined) {
      actualVsForecastByMonth(selArea, selTimeRes, selMonth, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear !== undefined) {
      actualVsForecastByYear(selArea, selTimeRes, selYear, selFormat);
    } else if (selDate === undefined && selMonth === undefined && selYear === undefined) {
      const d = new Date();
      const day = d.getDate().toString();
      const month = (d.getMonth()+1).toString();
      const year = d.getFullYear().toString();
      const date = year + '-' + month + '-' + day;
      actualVsForecastByDay(selArea, selTimeRes, date, selFormat);
    } else {
      console.log('Sorry, not more than one of the (--date, --month, --year) options can be submitted')
    }
  })

// Den epitrepei newuser kai moduser mazi
program
  .command('Admin')
  .alias('admin')
  .description('Administrator activities')
  .option('-n, --newuser <newUser>', 'Create a new user')
  .option('-m, --moduser <username>', 'Modify a user')
  .option('-u, --userstatus <username>', 'Retrieve user\'s status')
  .option('-d, --newdata <dataset>', 'Upload new data to dataset')
  .option('-p, --passw <password>', 'User\'s password')
  .option('-e, --email <email>', 'User\'s email')
  .option('-q, --quota <quota>', 'User\'s quota', '50')
  .option('-s, --source <filename>', 'The file\'s path')
  .action(options => {
    if (options.newuser !== undefined) {
      if (options.moduser !== undefined || options.userstatus !== undefined || options.newdata !== undefined) {
        console.log('Error: only one of [ --newuser , --moduser, --userstatus, --newdata] can be submitted')
      } else {
        const flag = checkUserInfo(options.passw, options.email);
        if (flag) {
          adminNewUser(options.newuser, options.passw, options.email, options.quota);
        }
      }
    }
    else if (options.moduser !== undefined) {
      if (options.userstatus !== undefined || options.newdata !== undefined) {
        console.log('Error: only one of [ --newuser , --moduser, --userstatus, --newdata] can be submitted')
      } else {
        const flag = checkUserInfo(options.passw, options.email);
        if (flag) {
          adminModUser(options.moduser, options.passw, options.email, options.quota);
        }
      }
    }
    else if (options.userstatus !== undefined) {
      if (options.newdata !== undefined) {
        console.log('Error: only one of [ --newuser , --moduser, --userstatus, --newdata] can be submitted')
      } else {
        adminUserStatus(options.userstatus);
      }
    }
    else if (options.newdata !== undefined) {
      const datasets = ['ActualTotalLoad', 'AggregatedGenerationPerType', 'DayAheadTotalLoadForecast']
      if (!datasets.includes(options.newdata)) {
        console.log('Error: not appropriate dataset selected. [ ActualTotalLoad | AggregatedGenerationPerType | DayAheadTotalLoadForecast ]')
      } else {
        if (options.source === undefined) {
          console.log('Error: missing file. Please type in the option \'--source <filename>\'')
        } else {
          adminNewData(options.newdata, options.source);
        }
      }
    }
  })

// error on unknown commands
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

function checkUserInfo(password, email) {
  if (password === undefined) {
    console.log('Error: missing password. Please type in the option \'--passw <password>\' to enter user\'s password')
  }
  if (email === undefined) {
    console.log('Error: missing email. Please type in the option \'--email <email>\' to enter user\'s email')
  }
  if (password !== undefined && email !== undefined) {
    return true;
  } else {
    return false;
  }
}

function checkForExtraOptionArgs(currentOption) {
  // terminalArgs: all the terminal arguments
  var terminalArgs = process.argv;

  // find the current options value current
  // index on the terminal args array,
  // add next option values before the next
  // -<opt> or --<option>

  var currentIndex = terminalArgs.indexOf(currentOption);
  var optionArgs = currentOption;
  for (let i=currentIndex+1; i<terminalArgs.length; i++) {
    if (terminalArgs[i].startsWith('-')) {
      break;
    }
    optionArgs = optionArgs + ' ' + terminalArgs[i];
  }
  return optionArgs;
}

program.parse(process.argv)
