function createOpeningLebTriggers() {
    ScriptApp.newTrigger('openLebDevs')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(16)
    .nearMinute(10)
    .inTimezone('America/New_York')
    .create();
  
    ScriptApp.newTrigger('closeLebDevs')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
    .atHour(16)
    .nearMinute(41)
    .inTimezone('America/New_York')
    .create();
  }
  
  
  function deleteAllTriggers() {
    const allTriggers = ScriptApp.getProjectTriggers();
    allTriggers.map( trigger => ScriptApp.deleteTrigger(trigger))
  }
  