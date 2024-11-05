// All of the trees for a chosen plot
let currentTrees = new Array();
//////////// LOAD IN PAGE FUNCTIONS ////////////
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
//////////// CONSTANTLY CALLED FUNCTIONS ////////////
// Updating the table for a new plot choice
function updateSurveyTable() {
    const addButton = document.getElementById("add-button");
    const surveyTable = document.getElementById("survey-table");
    // Making the survey visible
    if (surveyTable.style.visibility == "hidden") {
        addButton.style.visibility = "visible";
        surveyTable.style.visibility = "visible";
    }
    // Getting our plot
    const select = document.getElementById("plot-select");
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);
    //TODO: Use API to get a JSON file for the provided plot
    changeArrFromJson( /*JSON obj goes in here*/);
    //TODO: Use the an API call to get and set the year
    const currentYear = 2025;
    //Clear out the current items in the table
    const body = document.getElementById("table-body");
    body.innerHTML = '';
    // Adds the new items to the body
    for (let i = 0; i < currentTrees.length; i++) {
        let newRow = document.createElement('tr');
        newRow.id = "" + i;
        let tree = currentTrees[i];
        // Forming each view button
        let updater = document.createElement('td');
        let button = document.createElement('button');
        updater.style.width = "16%";
        updater.style.minWidth = "150px";
        button.id = "table-button";
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#pop-up');
        button.appendChild(document.createTextNode("Info"));
        // Each other aspect of an entry
        updater.appendChild(button);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode("" + tree.treeSize));
        let species = document.createElement('td');
        species.appendChild(document.createTextNode("" + tree.species));
        if (tree.year == currentYear) {
            newRow.className = "table-active";
        }
        // Adding each entry aspect
        newRow.appendChild(updater);
        newRow.appendChild(tag);
        newRow.appendChild(size);
        newRow.appendChild(species);
        body.appendChild(newRow);
    }
    //Enable the tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]');
}
// Setting the current array to contain the values from a json file
function changeArrFromJson( /*JSON objs goes in here*/) {
    //cats over the json strings with its attributes into the custom class
    //each obj into the array 
    currentTrees = [new tableItem(), new tableItem(), new tableItem(), new tableItem(), new tableItem(), new tableItem()];
}
//////////// CLASS TO MAKE INFO FROM DB WORK ////////////
// Outline for the items themselves
class tableItem {
    constructor() {
        this.year = 2025;
    }
}
// Aspects of trees
var size;
(function (size) {
    size[size["Small"] = 0] = "Small";
    size[size["Medium"] = 1] = "Medium";
    size[size["Big"] = 2] = "Big";
})(size || (size = {}));
var match;
(function (match) {
    match[match["Definitely"] = 0] = "Definitely";
    match[match["Probably"] = 1] = "Probably";
    match[match["NewTree"] = 2] = "NewTree";
    match[match["OldTree"] = 3] = "OldTree";
    match[match["Lost"] = 4] = "Lost";
})(match || (match = {}));
//# sourceMappingURL=survey-script.js.map