// Where we can chose our plot
var select = document.getElementById("plot-select");
// All of the trees for a chosen plot
// Populating the plot drop down
function createPlotOptions() {
    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (var i = 1; i < 41; i++) {
        var option = document.createElement('option');
        option.value = "" + i;
        option.appendChild(document.createTextNode("" + i));
        select.appendChild(option);
    }
}
// Updating the table for a new plot choice
function updateSurveyTable() {
    var surveyTable = document.getElementById("survey-table");
    if (surveyTable.style.visibility == "hidden") {
        surveyTable.style.visibility = "visible";
    }
    // Getting our plot
    var chosenPlot = parseInt(select.options[select.selectedIndex].value);
    //TODO: Do an API call to get all of the trees in the chosen plot
    //TODO: Clear out the current items in the table
}
// Setting the current array to contain the values from a json file
//# sourceMappingURL=survey-script.js.map