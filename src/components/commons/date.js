import moment from 'moment';

const baseDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Webnesday",
  "Thurday",
  "Friday",
  "Saturday",
];
const arrayDate = (week, year) => {
  return baseDay.map((item) => {
    return moment().day(item).year(year).week(week).format("DD-MM-YYYY");
  });
};


Date.prototype.getWeek = function (dowOffset) {
  var nday, nYear;
  dowOffset = typeof dowOffset == "int" ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
            the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

const getWeekYearNow = () => {
  const n = new Date();
  return arrayDate(n.getWeek() + 1, n.getFullYear());
};

const arrayDatetoString = arr => {
  var temp =arr.map(item => moment(item, "DD-MM-YYYY"));
  console.log(temp)
  var month = temp[0].format("MMMM");
  var rDate = temp[0].format("DD") + "-" + temp[6].format("DD");
  var year = temp[0].format("YYYY");
  return month + " " + rDate + " " + year;
}

export { arrayDate, getWeekYearNow, arrayDatetoString }