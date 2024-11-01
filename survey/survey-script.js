// All of the trees for a chosen plot
// Populating the plot drop down
function createPlotOptions() {
    const select = document.getElementById("plot-select");
    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (let i = 1; i < 41; i++) {
        const option = document.createElement('option');
        option.value = "" + i;
        option === null || option === void 0 ? void 0 : option.appendChild(document.createTextNode("" + i));
        select.appendChild(option);
    }
}
// Updating the table for a new plot choice
function updateSurveyTable() {
    const surveyTable = document.getElementById("survey-table");
    if (surveyTable.style.visibility == "hidden") {
        surveyTable.style.visibility = "visible";
    }
    // Getting our plot
    const select = document.getElementById("plot-select");
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);
    //TODO: Do an API call to get all of the trees in the chosen plot
    const test = new tableItems();
    console.log(test);
    //TODO: Clear out the current items in the table
}
// Setting the current array to contain the values from a json file
class tableItems {
    constructor() {
    }
}
// Aspects of trees
var size;
(function (size) {
    size[size["small"] = 0] = "small";
    size[size["medium"] = 1] = "medium";
    size[size["big"] = 2] = "big";
})(size || (size = {}));
var match;
(function (match) {
    match[match["definitely"] = 0] = "definitely";
    match[match["probably"] = 1] = "probably";
    match[match["newTree"] = 2] = "newTree";
    match[match["oldTree"] = 3] = "oldTree";
    match[match["lost"] = 4] = "lost";
})(match || (match = {}));
//# sourceMappingURL=survey-script.js.map