// All of the trees for a chosen plot
let currentTrees = new Array();
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
    //TODO: Use API to get a JSON file for the provided plot
    changeArrFromJson( /*JSON obj goes in here*/);
    //Clear out the current items in the table
    const body = document.getElementById("table-body");
    body.innerHTML = '';
    // Adds the new items to the body
    for (let i = 0; i < currentTrees.length; i++) {
        let newRow = document.createElement('tr');
        newRow.id = "" + i;
        let tree = currentTrees[i];
        // The view button
        let updater = document.createElement('td');
        let button = document.createElement('button');
        updater.style.width = "10%";
        updater.style.minWidth = "150px";
        button.id = "table-button";
        //button.onclick = "";
        button.appendChild(document.createTextNode("Info"));
        // Each other aspect of the button
        updater.appendChild(button);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode("" + tree.treeSize));
        let species = document.createElement('td');
        species.appendChild(document.createTextNode("" + tree.species));
        newRow.appendChild(updater);
        newRow.appendChild(tag);
        newRow.appendChild(size);
        newRow.appendChild(species);
        body.appendChild(newRow);
    }
}
// Setting the current array to contain the values from a json file
function changeArrFromJson( /*JSON objs goes in here*/) {
    //cats over the json strings with its attributes into the custom class
    //each obj into the array 
    currentTrees = [new tableItems(), new tableItems()];
}
// Class for storing objects to represent a tree from the DB
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