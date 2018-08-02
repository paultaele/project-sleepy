function init() {

  // get the list of files
  var filenames = JSON.parse(File2Strokes.readFile(filenamesFile));

  // get a single filename and corresponding stroke data
  var filename = filenames[5];
  var strokes = File2Strokes.parse("data/" + filename);

  // calculate features
  var f01 = calculateFeature01(strokes);
  var f02 = calculateFeature02(strokes);
  var f03 = calculateFeature03(strokes);
  var f04 = calculateFeature04(strokes);
  var f05 = calculateFeature05(strokes);
  var f06 = calculateFeature06(strokes);
  var f07 = calculateFeature07(strokes);
  var f08 = calculateFeature08(strokes);
  var f09 = calculateFeature09(strokes);
  var f10 = calculateFeature10(strokes);
  var f11 = calculateFeature11(strokes);
  var f12 = calculateFeature12(strokes);
  var f13 = calculateFeature13(strokes);
  var fHH = calculateFeatureHH(strokes);
  var features = [f01, f02, f03, f04, f05, f06, f07, f08, f09, f10, f11, f12, f13, fHH];

  outputFeatures(features);  
}

// TODO
function calculateFeature01(input) { return NaN; }
function calculateFeature02(input) { return NaN; }
function calculateFeature03(input) { return NaN; }
function calculateFeature04(input) { return NaN; }
function calculateFeature05(input) { return NaN; }
function calculateFeature06(input) { return NaN; }
function calculateFeature07(input) { return NaN; }
function calculateFeature08(input) { return NaN; }
function calculateFeature09(input) { return NaN; }
function calculateFeature10(input) { return NaN; }
function calculateFeature11(input) { return NaN; }
function calculateFeature12(input) { return NaN; }
function calculateFeature13(input) { return NaN; }

function calculateFeatureHH(input) {
  // copy strokes
  var strokes = copy(input);

  // calculate speeds of the strokes
  var speeds = calculateSpeeds(strokes);

  // calculate the average, min, and max speeds
  var averageSpeed = speeds.reduce( function(a, b) { return a + b; } , 0 ) / speeds.length;
  var minSpeed = speeds.reduce( function(a, b) { return a < b ? a : b; } , Number.MAX_SAFE_INTEGER);
  var maxSpeed = speeds.reduce( function( a, b) { return a > b ? a : b; } , 0);

  // TODO: complete hesitation feature
  //

  // temporary return value
  return NaN;
}

// #region Helper Functions

function calculateSpeeds(input) {
  // copy strokes
  var strokes = copy(input);
  
  // collect speeds for all strokes
  var speeds = [];
  for (var i = 0; i < strokes.length; ++i) {
    // get the current points
    var stroke = strokes[i]
    var points = stroke;

    // collect speeds for current stroke
    for (var j = 0; j < points.length - 1; ++j) {
      // get current and next point
      var p1 = points[j];
      var p2 = points[j + 1];

      // calculate speed
      var distance = calculateDistance(p1, p2);
      var time = p2.time - p1.time;

      // skip if time is negative
      if (time < 0) { continue; }

      var speed = distance / time;

      // add speed to collection
      speeds.push(speed);
    }

  }

  return speeds;
}

function calculateTotalDistance(input) {
  // copy strokes
  var strokes = copy(input);

  // calculate the total distance
  var totalDistance = 0;
  for (var i = 0; i < strokes.length; ++i) {
    // get the current points (i.e., stroke)
    var points = strokes[i];

    // calculate the stroke distance
    var strokeDistance = 0;
    for (var j = 0; j < points.length - 1; ++j) {
      // get the current point
      var p1 = points[j];
      var p2 = points[j + 1];

      // get the current distance
      var distance = calculateDistance(p1, p2);

      // add into the stroke distance
      strokeDistance += distance;
    }

    // add into the total distance
    totalDistance += strokeDistance;
  }

  return totalDistance;
}

// calculates the Euclidean distance between two points 
function calculateDistance(p1, p2) {
  // get x and y values
  var x1 = p1.x;
  var x2 = p2.x;
  var y1 = p1.y;
  var y2 = p2.y;

  // calculate Euclidean distance
  var d = Math.sqrt( (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1) );

  return d;
}

function copy(object) {
  var temp = JSON.stringify(object);
  var copy = JSON.parse(temp);
  return copy;
}

function outputFeatures(features) {
  var output = "";
  for (var i = 0; i < features.length; ++i) {
    var feature = features[i];
    output += feature + "\t";
  }
  console.log(output);
}

// #endregion

// #region Fields

var filenamesFile = "filenames.json";

// #endregion




// ----------------------------------------------------------------------------------------------------




// File2Strokes: converts raw file to strokes array
var File2Strokes = {

  // #region Parsers

  parse: function(filename) {
    // get the file contents
    var contents = this.readFile(filename);

    // get the stroke data
    var strokes = this.parseStringToStrokes(contents);

    return strokes;
  },

  parseStringToStrokes: function(contents) {
    // split the contents into array of string lines
    var lines = contents.split("\n");

    // collect the strokes
    var strokes = [];
    var stroke = [];
    for (var i = 0; i < lines.length; ++i) {
      // get the current line and its tokens
      var line = lines[i];
      var tokens = line.split(" "); // separate by space delimiter

      // get the first token and check for line or non-line
      var firstToken = tokens[0].toLowerCase(); // lowercase the token
      if (firstToken !== "line") {
        // existing stroke array is non-empty => add existing stroke to strokes array 
        if (stroke.length > 0) { strokes.push(stroke); }

        // create a new empty stroke array
        stroke = [];
      }
      else if (firstToken === "line") {
        // parse the line string to point object
        var point = this.parseLineToPoint(line);

        // add point to stroke array
        stroke.push(point);
      }
    }

    return strokes;
  },

  parseLineToPoint: function(line) {
    // get the spaced-out tokens
    var tokens = line.split(" ");

    // get and parse time string
    var timeString = tokens[2] + " " + tokens[3] + " " + tokens[4];
    var time = Number.parseFloat(this.parseTokenToTime(timeString));

    // get the point string token
    var pointString = tokens[1];
    var pointTokens = pointString.split(",");
    var x = Number.parseFloat(pointTokens[2]);
    var y = Number.parseFloat(pointTokens[3]); 

    // create point object
    var point = {x: x, y: y, time: time};

    return point;
  },

  parseTokenToTime: function(input) {
    
    // get the date and time strings
    var tokens = input.split(" ");

    // convert date string to ISO format
    // 7/27/17
    let dateString = tokens[0]; {
      // get inner date tokens
      var dateTokens = dateString.split("/");
      var monthToken = dateTokens[0].length === 1 ? "0" + dateTokens[0] : dateTokens[0];
      var dayToken = dateTokens[1];
      var yearToken = "20" + dateTokens[2];

      // get ISO date string format
      dateString = yearToken + "-" + monthToken + "-" + dayToken;
    }

    // convert time string to ISO format
    var milliseconds;
    var ampm = tokens[2].toLowerCase();
    let timeString = tokens[1]; {
      // get inner time tokens
      var timeTokens = timeString.split(":");
      var hourToken = timeTokens[0].length === 1 ? "0" + timeTokens[0] : timeTokens[0];
      var minuteToken = timeTokens[1];
      var secondToken = timeTokens[2];
      var millisecondToken = timeTokens[3];

      // case: time is PM => add 12 hours
      if (ampm === "pm") { hourToken = Number.parseInt(hourToken) + 12; }

      // get ISO time string format
      timeString = "T" + hourToken + ":" + minuteToken + ":" + secondToken + "Z";

      // convert fractional seconds to milliseconds (e.g., .94082 seconds => 9408.2 seconds)
      milliseconds = Number.parseInt(millisecondToken) / 100;
    }

    // convert to Date object and get milliseconds
    var date = new Date(dateString + timeString);
    var time = date.getTime() + milliseconds;

    return time;
  },

  // #endregion

  // #region File I/O

  readFile: function(fileName) {
    var content;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        content = request.responseText;
      }
    };
    request.open("GET", fileName, false);
    request.send();
    return content;
  },

  // #endregion

};
