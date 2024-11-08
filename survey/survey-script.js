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
    const grayWarning = document.getElementById("gray-warning");
    const surveyTable = document.getElementById("survey-table");
    // Making the survey visible
    if (surveyTable.style.visibility == "hidden") {
        addButton.style.visibility = "visible";
        grayWarning.style.visibility = "visible";
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
        button.onclick = function () { updateCurrentTree(i); };
        button.appendChild(document.createTextNode("Info"));
        // Each other aspect of an entry
        updater.appendChild(button);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode("" + tree.sizeClass));
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
}
function createNewTree() {
    // Resets the modal to take in new info
    clearTags();
    const species = document.createElement("input");
    species.style.textAlign = "left";
    document.getElementById("give-species").appendChild(species);
    const year = document.createElement("input");
    year.type = "number";
    document.getElementById("give-date").appendChild(year);
}
function updateCurrentTree(placement) {
    clearTags();
    const toUpdate = currentTrees[placement];
    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
    document.getElementById("give-species").appendChild(species);
    const year = document.createElement("h4");
    year.appendChild(document.createTextNode("" + toUpdate.year));
    document.getElementById("give-date").appendChild(year);
    // Transfer info from array into modal
    const tag = document.getElementById("given-tag");
    tag.value = "" + currentTrees[placement].recentTag;
    const status = document.getElementById("given-status");
    status.value = statusName.get(currentTrees[placement].status);
    console.log(status.value);
    const sizeClass = document.getElementById("given-size-class");
    sizeClass.value = sizeClassName.get(currentTrees[placement].sizeClass);
    const bdh = document.getElementById("given-bdh");
    bdh.value = "" + currentTrees[placement].DBH;
    const matchNum = document.getElementById("given-match-num");
    matchNum.value = "" + currentTrees[placement].matchNum;
    const comment = document.getElementById("given-comment");
    comment.value = "" + currentTrees[placement].comments;
}
// How createNewTree() and updateCurrentTree(placement: number) actually add to our db
function confirmUpdate() {
    // Turns modal info into a tableItem
    const selectPlot = document.getElementById("plot-select");
    const chosenPlot = parseInt(selectPlot.options[selectPlot.selectedIndex].value);
    const getSpecies = document.getElementById("give-species");
    let species = "";
    if (getSpecies.firstChild instanceof HTMLInputElement) {
        species = getSpecies.firstChild.value;
    }
    else if (getSpecies.firstChild instanceof HTMLHeadingElement) {
        species = getSpecies.firstChild.innerText;
    }
    const getYear = document.getElementById("give-date");
    let year = 2025;
    if (getYear.firstChild instanceof HTMLInputElement) {
        year = parseInt(getYear.firstChild.value);
    }
    else if (getYear.firstChild instanceof HTMLHeadingElement) {
        year = parseInt(getYear.firstChild.innerText);
    }
    const recentTag = parseInt(document.getElementById("given-tag").value);
    const status = document.getElementById("given-status").selectedIndex;
    const sizeClass = document.getElementById("given-size-class").selectedIndex;
    const dbh = parseInt(document.getElementById("given-match-num").value);
    const matchNum = (document.getElementById("given-match-num").selectedIndex) + 1;
    const comment = document.getElementById("given-comment").value;
    if (dbh == 0 || species == "") {
        onModalWarning();
    }
    else {
        offModalWarning();
        const treeToAPI = new tableItem(chosenPlot, species, year, recentTag, status, sizeClass, dbh, matchNum, comment);
        //TODO: Sends tableItem to the API
        currentTrees.push(treeToAPI); //TESTING FOR RN
    }
}
function clearTags() {
    document.getElementById("give-species").innerHTML = "";
    document.getElementById("give-date").innerHTML = "";
    document.getElementById("given-tag").value = "-1";
    document.getElementById("given-status").value = "Alive";
    document.getElementById("given-size-class").value = "Small";
    document.getElementById("given-bdh").value = "0";
    document.getElementById("given-match-num").value = "1";
    document.getElementById("given-comment").value = "";
}
// Setting the current array to contain the values from a json file
function changeArrFromJson( /*JSON objs goes in here*/) {
    // Clear out current items
    //currentTrees = new Array<tableItem>();
    // TODO: traverse JSON file from API and add each obj into currentTrees
}
// Easy toggles for the warning notice
function onModalWarning() {
    document.getElementById("submission-notice").style.visibility = "visible";
}
function offModalWarning() {
    document.getElementById("submission-notice").style.visibility = "hidden";
}
//////////// CLASS TO MAKE INFO FROM DB WORK ////////////
// Outline for the items themselves
class tableItem {
    constructor(plotId, species, year, recentTag, status, sizeClass, DBH, matchNum, comment) {
        this.plotId = plotId;
        this.species = species;
        this.year = year;
        this.recentTag = recentTag;
        this.status = status;
        this.sizeClass = sizeClass;
        this.DBH = DBH;
        this.matchNum = matchNum;
        this.comments = comment;
    }
}
// Aspects of trees
var state;
(function (state) {
    state[state["Alive"] = 0] = "Alive";
    state[state["Sick"] = 1] = "Sick";
    state[state["Dead"] = 2] = "Dead";
    state[state["Fallen"] = 3] = "Fallen";
})(state || (state = {}));
var size;
(function (size) {
    size[size["Small"] = 0] = "Small";
    size[size["Medium"] = 1] = "Medium";
    size[size["Big"] = 2] = "Big";
})(size || (size = {}));
var match;
(function (match) {
    match[match["Definitely"] = 1] = "Definitely";
    match[match["Probably"] = 2] = "Probably";
    match[match["NewTree"] = 3] = "NewTree";
    match[match["OldTree"] = 4] = "OldTree";
    match[match["Lost"] = 5] = "Lost";
})(match || (match = {}));
// Maps to access the aspects of each tree
const statusName = new Map([
    [state.Alive, "Alive"],
    [state.Sick, "Sick"],
    [state.Dead, "Dead"],
    [state.Fallen, "Fallen"],
]);
const sizeClassName = new Map([
    [size.Small, "Small"],
    [size.Medium, "Medium"],
    [size.Big, "Big"],
]);
//# sourceMappingURL=survey-script.js.map