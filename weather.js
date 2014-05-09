var parsed_json;
var msInDay = 86400000;
var today = new Date();

var storedQueriedDay = (new Date).valueOf();
var storedZipcode = "02139";

function setParsedJson(s) {
  parsed_json = s;
}

function rebuildParsedJson(today, queriedDay, zipcode) { 
  $.ajax({ 
    url : "http://api.wunderground.com/api/a3b4d4d3f9c829fc/forecast10day/geolookup/conditions/q/MA/" + zipcode + ".json",
    dataType : "jsonp",
    success : function(parsed_json) {
        setParsedJson(parsed_json);
        makeWeatherApp(today, queriedDay);
      } 
    }); 
  }
  
// Takes as input the dictionary returned by the weather API, and prepares the weather app.
function makeWeatherApp(today, queriedDay) {
  var differenceInMS = queriedDay - today; 
  var differenceInDays = Math.floor(differenceInMS / msInDay);
  var differenceInPeriods = differenceInDays * 2;
  
  var location = parsed_json['location']['city']; 
  
  if ((differenceInPeriods >= 0) && (differenceInPeriods < 20)) {
    var temp_of_queried_day = parsed_json['forecast']['txt_forecast']['forecastday'][differenceInPeriods]['fcttext'];
    var img_url = parsed_json['forecast']['txt_forecast']['forecastday'][differenceInPeriods]['icon_url'];
  }
  else {
    var temp_of_queried_day = "No weather available for this date.";
    var img_url = "images/question.jpg";
  }
  
  var queriedDayDate = new Date();
  queriedDayDate.setTime(queriedDay);
  
  document.getElementById("weather-prediction").innerHTML = "Weather in " + location + " on " 
    + queriedDayDate.toDateString() + ":</br>" + temp_of_queried_day;
  document.getElementById("weather-img").src = img_url;
}

function updateWeatherFromDate(date) {
  var queriedDay = date.valueOf();
  storedQueriedDay = queriedDay;
  var todayRoundedDown = today.valueOf() - today.valueOf() % msInDay;
//  rebuildParsedJson(todayRoundedDown, queriedDay, storedZipcode);
  makeWeatherApp(today, queriedDay);
}

function updateWeatherFromLocation(zipcode) {
  var todayRoundedDown = today.valueOf() - today.valueOf() % msInDay;
  storedZipcode = zipcode;
  rebuildParsedJson(todayRoundedDown, storedQueriedDay, zipcode);
}

function getMonthNumber(month) {
  if (month == "January") {
    return "0";
  }
  if (month == "February") {
    return "1";
  }
  if (month == "March") {
    return "2";
  }
  if (month == "April") {
    return "3";
  }
  if (month == "May") {
    return "4";
  }
  if (month == "June") {
    return "5";
  }
  if (month == "July") {
    return "6";
  }
  if (month == "August") {
    return "7";
  }
  if (month == "September") {
    return "8";
  }
  if (month == "October") {
    return "9";
  }
  if (month == "November") {
    return "10";
  }
  if (month == "December") {
    return "11";
  }
  throw "Not a month: " + month;
}

function getMonthFromWrittenDate(date) {
  var start = date.indexOf(",") + 2;
  var end = date.indexOf(" ", start);
  var wordMonth = date.substring(start, end);
  return getMonthNumber(wordMonth);
}

function getDayFromWrittenDate(date) {
  var start = date.indexOf(" ") + 1;
  var start = date.indexOf(" ", start) + 1;
  var end = date.indexOf(",", start);
  return date.substring(start, end);
}

function getYearFromWrittenDate(date) {
  var start = date.indexOf(",") + 1;
  var start = date.indexOf(",", start) + 2;
  var end = date.indexOf(" ", start);
  return date.substring(start, end);
}