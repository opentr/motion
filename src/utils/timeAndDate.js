import moment from "moment";

const thisYear = moment().format("YYYY");
const hundredYearsAgo = moment()
  .subtract(100, "years")
  .format("YYYY");

let _years = [];
let year = thisYear;
while (year > hundredYearsAgo) {
  _years.push(year);
  year--;
}

export const DAYS_BEFORE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export const DAYS_BEFORE_DROPDOWN = DAYS_BEFORE.map(item => {
  return {
    description:
      item !== 1 ? item + " days before start" : item + " day before start",
    id: item
  };
});

export const YEARS = _years;

export const YEARS_DROPDOWN = YEARS.map((item, index) => {
  return { description: item, id: item };
});

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const MONTHS_DROPDOWN = MONTHS.map((item, index) => {
  return { description: item, id: index };
});

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const WEEKDAYS_DROPDOWN = WEEKDAYS.map((item, index) => {
  return { description: item, id: index };
});

let _days = [];
const startDay = 1;
const endDay = 31;
let day = startDay;
while (day <= endDay) {
  _days.push(day);
  day++;
}

export const DAYS = _days;

export const DAYS_DROPDOWN = DAYS.map((item, index) => {
  return { description: item.toString(), id: index };
}).slice(0);

export function getWeekdaysBetweenDates(firstDate, secondDate, dayOfWeek) {
  var MILISECONDS_IN_DAY = 86400000;

  function getNextDayOfWeek(date, dayOfWeek) {
    date.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return date;
  }

  firstDate = getNextDayOfWeek(firstDate, dayOfWeek);
  if (firstDate > secondDate) {
    return 0;
  }

  return 1 + Math.floor((secondDate - firstDate) / MILISECONDS_IN_DAY / 7);
}

// gets datetime format for displaying below messages in chat or notifications,
// for example if it's today it will be 09:50 if it's before today it's July 19th
export function convertDateForMessage(dateTime, todayAgo = false) {
  //console.log('convert ', dateTime);
  const today = moment().startOf("day");
  const day = moment(dateTime);
  if (day.isSame(today, "day")) {
    return todayAgo ? day.fromNow() : day.format("HH:mm");
  } else {
    return day.format("MMM Do");
  }
}

export function compareDates(startDate, endDate) {
  return moment.duration(moment(endDate).diff(moment(startDate))) < 0;
}
export function diffDays(startDate, endDate) {
  const diffDuration = moment.duration(moment(endDate).diff(moment(startDate)));
  return diffDuration.days();
}

const today = moment().startOf("day");

export function isLater(date1, date2) {
  const now = moment();
  const d1 = date1 === "" ? now : moment(date1);
  const d2 = date2 === "" ? now : moment(date2);
  return d1.diff(d2) <= 0;
}

export function isTodayOrLater(d) {
  return today.diff(d) <= 0;
}

// gets string 4 days 3 hours or similar
export function diffNow(diffDate, oneMetric = false) {
  const now = moment();
  const exp = moment(diffDate);
  const diffDuration = moment.duration(exp.diff(now));
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();
  // console.log('diffNow', days, hours, minutes);
  if (days === 0)
    return (
      (hours !== 0 ? hours + (hours !== 1 ? " hours " : " hour ") : "") +
      (oneMetric === false
        ? minutes !== 0
          ? minutes + (minutes !== 1 ? " minutes" : " minute")
          : ""
        : "")
    );
  return (
    days +
    (days !== 1 ? " days " : " day ") +
    (oneMetric === false
      ? hours !== 0 ? hours + (hours !== 1 ? " hours" : " hour") : ""
      : "")
  );
}
