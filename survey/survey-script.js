var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// All of the trees for a chosen plot
let currentTrees = new Array();
//TODO: MAKE THIS AN API CALL TO GET THE REAL CURRENT YEAR!
const currentCensusYear = 2025;
function getApiUrlBase() {
    return __awaiter(this, void 0, void 0, function* () {
        const configRes = yield fetch("/api_config.json");
        const { urlBase } = yield configRes.json();
        return urlBase;
    });
}
//////////// LOAD IN PAGE FUNCTIONS ////////////
function setupSurvey() {
    createPlotOptions();
}
// Populating the plot drop down
function createPlotOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Get the API endpoint
        const plotCountUrl = (yield getApiUrlBase()) + "plot-ids";
        // Make API call with authentication token
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        const apiRes = yield fetch(plotCountUrl, {
            headers,
            method: "GET",
        });
        const apiObj = yield apiRes.json();
        const plotIds = apiObj.plotIds;
        const select = document.getElementById("plot-select");
        for (const plotId of plotIds) {
            const option = document.createElement('option');
            option.value = "" + plotId;
            option === null || option === void 0 ? void 0 : option.appendChild(document.createTextNode("" + plotId));
            select.appendChild(option);
        }
    });
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
        let icon = document.createElement('i');
        updater.style.width = "16%";
        updater.style.minWidth = "150px";
        icon.id = "table-icon";
        icon.setAttribute('data-bs-toggle', 'modal');
        icon.setAttribute('data-bs-target', '#pop-up');
        icon.onclick = function () { updateCurrentTree(i); };
        icon.className = "fas fa-circle-info";
        // Each other aspect of an entry
        updater.appendChild(icon);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode(sizeClassName.get(tree.sizeClass)));
        let species = document.createElement('td');
        species.appendChild(document.createTextNode("" + tree.species));
        if (tree.year == currentCensusYear) {
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
}
function updateCurrentTree(placement) {
    clearTags();
    // Transfer info from array into modal
    const toUpdate = currentTrees[placement];
    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
    document.getElementById("give-species").appendChild(species);
    const year = document.getElementById("given-date");
    year.innerHTML = "" + currentTrees[placement].year;
    const tag = document.getElementById("given-tag");
    tag.value = "" + currentTrees[placement].recentTag;
    const status = document.getElementById("given-status");
    status.value = statusName.get(currentTrees[placement].status);
    console.log(status.value);
    const sizeClass = document.getElementById("given-size-class");
    sizeClass.value = sizeClassName.get(currentTrees[placement].sizeClass);
    const dbh = document.getElementById("given-dbh");
    dbh.value = "" + currentTrees[placement].DBH;
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
    const recentTag = parseInt(document.getElementById("given-tag").value);
    const status = document.getElementById("given-status").selectedIndex;
    const sizeClass = document.getElementById("given-size-class").selectedIndex;
    const dbh = parseInt(document.getElementById("given-dbh").value);
    const matchNum = (document.getElementById("given-match-num").selectedIndex) + 1;
    const comment = document.getElementById("given-comment").value;
    if (dbh <= 0 || species == "") {
        onModalWarning();
    }
    else {
        offModalWarning();
        const treeToAPI = new tableItem(chosenPlot, species, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
        //TODO: Sends tableItem to the API
        currentTrees.push(treeToAPI); //TESTING FOR RN
    }
}
function clearTags() {
    document.getElementById("give-species").innerHTML = "";
    document.getElementById("given-date").innerText = "" + currentCensusYear;
    document.getElementById("given-tag").value = "-1";
    document.getElementById("given-status").value = "Alive";
    document.getElementById("given-size-class").value = "Small";
    document.getElementById("given-dbh").value = "0";
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