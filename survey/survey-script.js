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
const currentCensusYear = -1;
// Boolean to determine POST vs PUT requests
let isNewTree;
function getApiUrlBase() {
    return __awaiter(this, void 0, void 0, function* () {
        const configRes = yield fetch("/api_config.json");
        const { urlBase } = yield configRes.json();
        return urlBase;
    });
}
//////////// LOAD IN PAGE FUNCTIONS ////////////
/**
 * Adjusts the pop-up button based on whether or not there is an open census
 */
function setupModalButton() {
    // Giving the user the option to update if appropriate
    const updateButton = document.getElementById("pop-up-update");
    if (currentCensusYear == -1) {
        updateButton.style.backgroundColor = "grey";
        updateButton.innerHTML = "";
        updateButton.appendChild(document.createTextNode("Census Not Open"));
        updateButton.disabled = true;
        updateButton.onclick = () => { };
    }
}
/**
 * Populates the drop down options with each of the plots in the arb
 */
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
/**
 * Based on the currently selected plot chose, updates the potential
 * options within the survey table.
 */
function updateSurveyTable() {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Grabbing each of HTML elements to be made visible if applicable
        const addButton = document.getElementById("add-button");
        const grayWarning = document.getElementById("gray-warning");
        const surveyTable = document.getElementById("survey-table");
        if (surveyTable.style.visibility == "hidden") {
            addButton.style.visibility = "visible";
            grayWarning.style.visibility = "visible";
            surveyTable.style.visibility = "visible";
        }
        // Getting our plot
        const select = document.getElementById("plot-select");
        const chosenPlot = parseInt(select.options[select.selectedIndex].value);
        // Get the API endpoint
        let treesUrl = (yield getApiUrlBase()) + "trees";
        // Add query options
        treesUrl += `?plot=${chosenPlot}&current_census=${currentCensusYear}`;
        // Add authentication token to headers
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        // Make an API request for the tree entries
        const apiRes = yield fetch(treesUrl, {
            headers,
            method: "GET",
        });
        const apiObj = yield apiRes.json();
        // Update and sort current trees
        changeArrFromJson(apiObj);
        currentTrees.sort((a, b) => a.recentTag - b.recentTag);
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
            icon.style.cursor = "pointer";
            icon.ariaLabel = "See more info on the provided tree";
            icon.setAttribute('data-bs-toggle', 'modal');
            icon.setAttribute('data-bs-target', '#pop-up');
            icon.onclick = function () { updateCurrentTree(i); };
            icon.className = "fas fa-circle-info";
            // Each other aspect of an entry
            updater.appendChild(icon);
            let tag = document.createElement('td');
            tag.appendChild(document.createTextNode("" + tree.recentTag));
            let species = document.createElement('td');
            species.appendChild(document.createTextNode("" + tree.species));
            let size = document.createElement('td');
            size.appendChild(document.createTextNode(sizeClassName.get(tree.sizeClass)));
            // Seeing if a table option should be grayed out
            if (tree.year == currentCensusYear) {
                newRow.className = "table-active";
            }
            // Adding each entry aspect
            newRow.appendChild(updater);
            newRow.appendChild(tag);
            newRow.appendChild(species);
            newRow.appendChild(size);
            // Adding the constructed row to the table
            body.appendChild(newRow);
        }
    });
}
/**
 * Sets up the modal for entering in info about a new tree.
 */
function createNewTree() {
    // Resets the modal to take in new info
    refreshPopUp();
    // Adding in the ability to set a species name
    const species = document.createElement("input");
    species.style.textAlign = "left";
    species.ariaLabel = "Input species name";
    document.getElementById("give-species").appendChild(species);
    // Adjusting to POST to the API
    isNewTree = true;
}
/**
 * Sets up the modal to change information about a pre-existing tree.
 * @param placement the index of the selected tree in our array of trees for the plot.
 */
function updateCurrentTree(placement) {
    refreshPopUp();
    // Transfer info from array into modal
    const toUpdate = currentTrees[placement];
    // Set tableItem variable for confirm update to use
    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
    species.id = "given-species";
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
    dbh.value = "" + currentTrees[placement].dbh;
    const matchNum = document.getElementById("given-match-num");
    matchNum.value = "" + currentTrees[placement].matchNum;
    const comment = document.getElementById("given-comment");
    comment.value = "" + currentTrees[placement].comments;
    // Adjusting to PUT to the API
    isNewTree = false;
}
/**
 * Adding the information from a filled out survey modal to our database
 */
function confirmUpdate() {
    // Turns modal info into a tableItem by grabbing each element from the modal
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
    // Ensuring no unfilled form is sent to the database
    if (dbh <= 0 || species == "") {
        onModalWarning();
    }
    else {
        offModalWarning();
        // Use a boolean to decide whether to PUT or POST
        if (isNewTree) {
            // Posting
        }
        else {
            // Putting
        }
        //TESTING FOR RN
        // TODO: Get put treeId instead of chosenPlot
        const treeToAPI = new tableItem(chosenPlot, species, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
        //TODO: Sends tableItem to the API
        currentTrees.push(treeToAPI);
    }
}
function putCensusEntry(item) {
    return __awaiter(this, void 0, void 0, function* () {
        // Convert table item to payload
        const payload = {
            year: item.year,
            treeId: item.treeId,
            recentTag: item.recentTag,
            dbh: item.dbh,
            status: statusName[item.status],
            matchNum: item.matchNum,
            comments: item.comments,
        };
        // Get the API endpoint
        const treesUrl = (yield getApiUrlBase()) + "trees";
        // Add authentication token to headers
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        // Make an API request to add/update the census entry
        yield fetch(treesUrl, {
            headers,
            method: "PUT",
            body: JSON.stringify(payload)
        });
    });
}
/**
 * Resets the survey modal.
 */
function refreshPopUp() {
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
function changeArrFromJson(censusEntries) {
    currentTrees = censusEntries.map((entry) => (new tableItem(entry.treeId, entry.species, entry.year, entry.recentTag, state[entry.status], // Convert status to state type
    size[entry.sizeClass], // Convert sizeClass to size type
    entry.dbh, entry.matchNum, entry.comments)));
}
// Easy toggles for the warning notices
function onModalWarning() {
    document.getElementById("submission-notice").style.visibility = "visible";
}
function offModalWarning() {
    document.getElementById("submission-notice").style.visibility = "hidden";
}
// Outline for the items themselves
class tableItem {
    constructor(treeId, species, year, recentTag, status, sizeClass, dbh, matchNum, comment) {
        this.treeId = treeId;
        this.species = species;
        this.year = year;
        this.recentTag = recentTag;
        this.status = status;
        this.sizeClass = sizeClass;
        this.dbh = dbh;
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