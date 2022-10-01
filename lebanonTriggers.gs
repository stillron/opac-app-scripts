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
    { name: 'CloseLebDevsOnSaturday', func: 'closeLebDevs', day: 'SATURDAY', hour: '17', minute: '5' }
    ]

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
