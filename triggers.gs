function makeAllTriggers() {
  const triggerList = [
    //Lebanon Hours
    { name: 'OpenLebDevsOnMonday', func: 'openLebDevs', day: 'MONDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnMonday', func: 'closeLebDevs', day: 'MONDAY', hour: '20', minute: '5' },
    { name: 'OpenLebDevsOnTuesday', func: 'openLebDevs', day: 'TUESDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnTuesday', func: 'closeLebDevs', day: 'TUESDAY', hour: '20', minute: '5' },
    { name: 'OpenLebDevsOnWednesday', func: 'openLebDevs', day: 'WEDNESDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnWednesday', func: 'closeLebDevs', day: 'WEDNESDAY', hour: '20', minute: '5' },
    { name: 'OpenLebDevsOnThursday', func: 'openLebDevs', day: 'THURSDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnThursday', func: 'closeLebDevs', day: 'THURSDAY', hour: '20', minute: '5' },
    { name: 'OpenLebDevsOnFriday', func: 'openLebDevs', day: 'FRIDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnFriday', func: 'closeLebDevs', day: 'FRIDAY', hour: '17', minute: '5' },
    { name: 'OpenLebDevsOnSaturday', func: 'openLebDevs', day: 'SATURDAY', hour: '9', minute: '40' },
    { name: 'CloseLebDevsOnSaturday', func: 'closeLebDevs', day: 'SATURDAY', hour: '17', minute: '5' },
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
