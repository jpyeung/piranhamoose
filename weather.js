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
    url : "http://api.wunderground.com/api/5e612b96bba18491/forecast10day/geolookup/conditions/q/MA/" + zipcode + ".json",
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
    var temp_of_queried_day = "No weather available for this date."
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
  rebuildParsedJson(todayRoundedDown, queriedDay, storedZipcode);
}

function updateWeatherFromLocation(zipcode) {
  var todayRoundedDown = today.valueOf() - today.valueOf() % msInDay;
  storedZipcode = zipcode;
  rebuildParsedJson(todayRoundedDown, storedQueriedDay, zipcode);
}