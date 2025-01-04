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
// The current census year
let currentCensusYear;
// Boolean to determine POST vs PUT requests
let isNewTree;
// Table item that was selected to use for PUT request
let selectedTableItem;
// Promise that resolves as the list of all tree species
let speciesListPromise;
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
 * Setups all of the info and restrictions surrounding whether or not a census
 * is in progress.
 */
function setupCensusDate() {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Get the API endpoint
        const censusDateUrl = (yield globalThis.baseApiUrl) + "census";
        // Make API call with authentication token
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        const apiRes = yield fetch(censusDateUrl, {
            headers,
            method: "GET",
        });
        // Converting the gathered json into a casted obj
        const apiObj = yield apiRes.json();
        // Setting the current census to be what the API gave
        if (apiObj.isActive) {
            currentCensusYear = apiObj.year;
        }
        else {
            currentCensusYear = -1;
        }
        // Adjusting update modal button accordingly
        setupModalButton();
    });
}
/**
 * Populates the drop down options with each of the plots in the arb
 */
function createPlotOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Get the API endpoint
        const plotCountUrl = (yield globalThis.baseApiUrl) + "plot-ids";
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
/**
 * Sets up the species list by fetching it from the API if it hasn't been set yet.
 *
 * @throws {Error} If there is an error while fetching the species list from the API.
 */
function setupSpeciesList() {
    return __awaiter(this, void 0, void 0, function* () {
        // If species list hasn't been set yet, create the promise
        if (!speciesListPromise) {
            // Set species list to the promise of the list
            speciesListPromise = (() => __awaiter(this, void 0, void 0, function* () {
                // Wait for auth token to be ready and form URL
                yield globalThis.authTokenReady;
                const speciesUrl = (yield globalThis.baseApiUrl) + "species";
                // Make API call with authentication token
                const headers = {
                    "Authorization": `Bearer ${globalThis.authToken}`
                };
                const apiRes = yield fetch(speciesUrl, {
                    headers,
                    method: "GET",
                });
                if (!apiRes.ok)
                    throw new Error("Error while fetching species list: " + (yield apiRes.text()));
                // Get list of all species from API call
                return yield apiRes.json();
            }))();
        }
    });
}
//////////// CONSTANTLY CALLED FUNCTIONS ////////////
function sortTrees() {
    // Getting the users choice
    const choice = document.getElementById("filter-select").selectedIndex;
    // Recent tag is chosen
    if (choice == 0) {
        currentTrees.sort((a, b) => a.recentTag - b.recentTag);
    }
    // Species is chosen
    else if (choice == 1) {
        currentTrees.sort((a, b) => a.species.localeCompare(b.species));
    }
    // Size class is chosen
    else {
        currentTrees.sort((a, b) => a.sizeClass - b.sizeClass);
    }
}
/**
 * Based on the currently selected plot chose, updates the potential
 * options within the survey table.
 */
function updateSurveyTable() {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Getting our plot
        const select = document.getElementById("plot-select");
        const chosenPlot = parseInt(select.options[select.selectedIndex].value);
        // Grabbing each of HTML elements to be made visible if applicable
        const selectShow = document.getElementById("select-show");
        if (chosenPlot != -1) {
            selectShow.style.visibility = "visible";
            selectShow.inert = false;
        }
        else {
            selectShow.style.visibility = "hidden";
            selectShow.inert = true;
        }
        // Get the API endpoint
        let treesUrl = (yield globalThis.baseApiUrl) + "trees";
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
        sortTrees();
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
            const tagText = tree.recentTag === -1 ? "Missing" : "" + tree.recentTag;
            tag.appendChild(document.createTextNode(tagText));
            let species = document.createElement('td');
            species.appendChild(document.createTextNode("" + tree.species));
            let size = document.createElement('td');
            size.appendChild(document.createTextNode(sizeClassToName.get(tree.sizeClass)));
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
function populateSpecies(dropDown) {
    return __awaiter(this, void 0, void 0, function* () {
        // Obtain list of species from promise
        const allSpecies = yield speciesListPromise;
        // Populate dropdown with species from API
        allSpecies.forEach(speciesName => {
            const option = document.createElement("option");
            option.value = speciesName;
            option.appendChild(document.createTextNode(speciesName));
            dropDown.appendChild(option);
        });
    });
}
/**
 * Sets up the modal for entering in info about a new tree.
 */
function createNewTree() {
    // Resets the modal to take in new info
    refreshPopUp();
    // Adding in the ability to set a species name
    const species = document.createElement("select");
    species.ariaLabel = "Choose species name";
    populateSpecies(species);
    document.getElementById("give-species").appendChild(species);
    // Adding in the ability to set which size class the tree falls into
    const sizeClass = document.createElement("select");
    const small = document.createElement("option");
    small.appendChild(document.createTextNode("Small"));
    sizeClass.appendChild(small);
    const medium = document.createElement("option");
    medium.appendChild(document.createTextNode("Medium"));
    sizeClass.appendChild(medium);
    const large = document.createElement("option");
    large.appendChild(document.createTextNode("Large"));
    sizeClass.appendChild(large);
    document.getElementById("give-size-class").appendChild(sizeClass);
    // Adjusting to POST to the API
    isNewTree = true;
}
/**
 * Sets up the modal to change information about a pre-existing tree.
 * @param index the index of the selected tree in our array of trees for the plot.
 */
function updateCurrentTree(index) {
    refreshPopUp();
    // Set tableItem variable for confirm update to use
    selectedTableItem = currentTrees[index];
    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + selectedTableItem.species));
    species.id = "given-species";
    document.getElementById("give-species").appendChild(species);
    const year = document.getElementById("given-date");
    year.innerHTML = "" + selectedTableItem.year;
    const tag = document.getElementById("given-tag");
    tag.value = "" + selectedTableItem.recentTag;
    const status = document.getElementById("given-status");
    status.value = statusName.get(selectedTableItem.status);
    const sizeClass = document.createElement("h4");
    sizeClass.appendChild(document.createTextNode(sizeClassToName.get(selectedTableItem.sizeClass)));
    sizeClass.id = "given-size-class";
    document.getElementById("give-size-class").appendChild(sizeClass);
    const dbh = document.getElementById("given-dbh");
    dbh.value = "" + selectedTableItem.dbh;
    const matchNum = document.getElementById("given-match-num");
    matchNum.value = "" + selectedTableItem.matchNum;
    const comment = document.getElementById("given-comment");
    comment.value = selectedTableItem.comments === "null" ? "" : selectedTableItem.comments;
    // Adjusting to PUT to the API
    isNewTree = false;
}
/**
 * Adding the information from a filled out survey modal to our database
 */
function confirmUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        // Resetting for the new submission
        offModalWarning();
        // Turns modal info into a tableItem by grabbing each element from the modal
        const selectPlot = document.getElementById("plot-select");
        const chosenPlot = parseInt(selectPlot.options[selectPlot.selectedIndex].value);
        const getSpecies = document.getElementById("give-species");
        let treeSpecies;
        if (getSpecies.firstChild instanceof HTMLSelectElement) {
            treeSpecies = getSpecies.firstChild.options[getSpecies.firstChild.selectedIndex].value;
        }
        else if (getSpecies.firstChild instanceof HTMLHeadingElement) {
            treeSpecies = getSpecies.firstChild.innerText;
        }
        const recentTag = parseFloat(document.getElementById("given-tag").value);
        const status = document.getElementById("given-status").selectedIndex;
        const getSizeClass = document.getElementById("give-size-class");
        let sizeClass;
        if (getSizeClass.firstChild instanceof HTMLSelectElement) {
            sizeClass = getSizeClass.firstChild.selectedIndex;
        }
        else if (getSizeClass.firstChild instanceof HTMLHeadingElement) {
            sizeClass = nameToSizeClass.get(getSizeClass.firstChild.innerText);
        }
        const dbh = parseFloat(document.getElementById("given-dbh").value);
        const matchNum = (document.getElementById("given-match-num").selectedIndex) + 1;
        const comment = document.getElementById("given-comment").value;
        // Ensuring no clearly inaccurate data isn't sent to the database
        if (configModalWarning(recentTag, dbh)) {
            offModalWarning();
            const treeForAPI = new tableItem(-1, treeSpecies, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
            // POST if a new tree, otherwise PUT
            if (isNewTree) {
                yield postNewTree(treeForAPI, chosenPlot);
            }
            else {
                treeForAPI.treeId = selectedTableItem.treeId;
                yield putCensusEntry(treeForAPI);
            }
            // Refresh survey table after update
            updateSurveyTable();
        }
    });
}
function postNewTree(item, plotId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Convert table item to payload
        const payload = {
            species: item.species,
            sizeClass: sizeClassToName.get(item.sizeClass),
            plotId: plotId,
            year: item.year,
            recentTag: item.recentTag === -1 ? null : item.recentTag,
            dbh: item.dbh,
            status: statusName.get(item.status),
            matchNum: item.matchNum,
            comments: item.comments === "" ? null : item.comments,
        };
        // Get the API endpoint
        const treesUrl = (yield globalThis.baseApiUrl) + "trees";
        // Add authentication token to headers
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        // Make an API request to add/update the census entry
        yield fetch(treesUrl, {
            headers,
            method: "POST",
            body: JSON.stringify(payload)
        });
    });
}
function putCensusEntry(item) {
    return __awaiter(this, void 0, void 0, function* () {
        // Convert table item to payload
        const payload = {
            year: item.year,
            treeId: item.treeId,
            recentTag: item.recentTag === -1 ? null : item.recentTag,
            dbh: item.dbh,
            status: statusName.get(item.status),
            matchNum: item.matchNum,
            comments: item.comments === "" ? null : item.comments,
        };
        // Get the API endpoint
        const treesUrl = (yield globalThis.baseApiUrl) + "trees";
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
    document.getElementById("given-status").value = "Live";
    document.getElementById("give-size-class").innerHTML = "";
    document.getElementById("given-dbh").value = "0";
    document.getElementById("given-match-num").value = "1";
    document.getElementById("given-comment").value = "";
}
// Setting the current array to contain the values from API object
function changeArrFromJson(censusEntries) {
    currentTrees = censusEntries.map((entry) => (new tableItem(entry.treeId, entry.species, entry.year, entry.recentTag === null ? -1 : entry.recentTag, state[entry.status], // Convert status to state type
    nameToSizeClass.get(entry.sizeClass), // Convert sizeClass to size type
    entry.dbh, entry.matchNum, entry.comments)));
}
/**
 * Checks if any warning needs to be displayed for the modal based on the user's input.
 * @param tag The most recent tag for a provided tree
 * @param dbh The DBH for a provided tree
 * @returns Whether their is any issues in the possible submission parameters for the modal
 */
function configModalWarning(tag, dbh) {
    let isFine = true;
    if (tag < -1) {
        document.getElementById("tag-row").style.backgroundColor = "#e34d42";
        isFine = false;
    }
    if (dbh <= 0 || dbh >= 999) {
        document.getElementById("dbh-row").style.backgroundColor = "#e34d42";
        isFine = false;
    }
    if (!isFine) {
        document.getElementById("submission-notice").style.visibility = "visible";
    }
    return isFine;
}
/**
 * Disables all warnings within the modal around the users provided information.
 */
function offModalWarning() {
    document.getElementById("tag-row").style.backgroundColor = "transparent";
    document.getElementById("dbh-row").style.backgroundColor = "transparent";
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
    state[state["Live"] = 0] = "Live";
    state[state["Sick"] = 1] = "Sick";
    state[state["Dead"] = 2] = "Dead";
    state[state["Fallen"] = 3] = "Fallen";
})(state || (state = {}));
var size;
(function (size) {
    size[size["Small"] = 0] = "Small";
    size[size["Medium"] = 1] = "Medium";
    size[size["Large"] = 2] = "Large";
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
    [state.Live, "Live"],
    [state.Sick, "Sick"],
    [state.Dead, "Dead"],
    [state.Fallen, "Fallen"],
]);
const sizeClassToName = new Map([
    [size.Small, "Small"],
    [size.Medium, "Medium"],
    [size.Large, "Large"],
]);
const nameToSizeClass = new Map([
    ["Small", size.Small],
    ["Medium", size.Medium],
    ["Large", size.Large],
]);
//# sourceMappingURL=survey-script.js.map