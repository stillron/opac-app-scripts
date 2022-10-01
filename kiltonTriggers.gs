function makeAllTriggers() {
  const triggerList = [
    //Kilton Hours
    { name: 'OpenKiltonDevsOnMonday', func: 'openKiltonDevs', day: 'MONDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnMonday', func: 'closeKiltonDevs', day: 'MONDAY', hour: '18', minute: '5' },
    { name: 'OpenKiltonDevsOnTuesday', func: 'openKiltonDevs', day: 'TUESDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnTuesday', func: 'closeKiltonDevs', day: 'TUESDAY', hour: '18', minute: '5' },
    { name: 'OpenKiltonDevsOnWednesday', func: 'openKiltonDevs', day: 'WEDNESDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnWednesday', func: 'closeKiltonDevs', day: 'WEDNESDAY', hour: '18', minute: '5' },
    { name: 'OpenKiltonDevsOnThursday', func: 'openKiltonDevs', day: 'THURSDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnThursday', func: 'closeKiltonDevs', day: 'THURSDAY', hour: '18', minute: '5' },
    { name: 'OpenKiltonDevsOnFriday', func: 'openKiltonDevs', day: 'FRIDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnFriday', func: 'closeKiltonDevs', day: 'FRIDAY', hour: '17', minute: '5' },
    { name: 'OpenKiltonDevsOnSaturday', func: 'openKiltonDevs', day: 'SATURDAY', hour: '9', minute: '40' },
    { name: 'CloseKiltonDevsOnSaturday', func: 'closeKiltonDevs', day: 'SATURDAY', hour: '17', minute: '5' }
  ];

  triggerList.forEach(trigger => makeTrigger(trigger));
}

function makeTrigger(trigs) {
  const { name, func, day, hour, minute } = trigs;
  Logger.log(`Creating trigger ${name}.`);
  ScriptApp.newTrigger(func)
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay[day])
    .atHour(hour)
    .nearMinute(minute)
    .inTimezone('America/New_York')
    .create();
}

function deleteAllTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  allTriggers.map(trigger => ScriptApp.deleteTrigger(trigger))
}
