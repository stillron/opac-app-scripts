function createTimeDrivenTriggers() {
ScriptApp.newTrigger('moveChromebooks')
.timeBased()
.onWeekDay(ScriptApp.WeekDay.TUESDAY)
.atHour(12)
.inTimezone('America/New_York')
.create();

ScriptApp.newTrigger('moveChromebooks')
.timeBased()
.everyMinutes(10)
.create();
}