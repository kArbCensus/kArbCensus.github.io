// Populating the plot drop down
function createPlotOptions() {
    var select = document.getElementById("plot-select");
    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (var i = 1; i < 41; i++) {
        var option = document.createElement('option');
        option.value = "" + i;
        option.appendChild(document.createTextNode("" + i));
        select === null || select === void 0 ? void 0 : select.appendChild(option);
    }
}
// Updating the table for a new plot choice
function updateSurveyTable() {
    var surveyTable = document.getElementById("survey-table");
    if (surveyTable.style.visibility == "hidden") {
        surveyTable.style.visibility = "visible";
    }
    // Getting our plot
    var selection = document.getElementById("plot-select");
    var chosenPlot = parseInt(selection.options[selection.selectedIndex].value);
    console.log(chosenPlot);
}
//# sourceMappingURL=survey-script.js.map