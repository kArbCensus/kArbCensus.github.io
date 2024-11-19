// All of the trees for a chosen plot
let currentTrees = new Array<tableItem>();

// The current census year
let currentCensusYear: number;

// Boolean to determine POST vs PUT requests
let isNewTree: boolean;

// Table item that was selected to use for PUT request
let selectedTableItem: tableItem;


//////////// LOAD IN PAGE FUNCTIONS ////////////



/**
 * Adjusts the pop-up button based on whether or not there is an open census
 */
function setupModalButton() {
    // Giving the user the option to update if appropriate
    const updateButton = document.getElementById("pop-up-update") as HTMLButtonElement;
    if (currentCensusYear == -1) {
        updateButton.style.backgroundColor = "grey"
        updateButton.innerHTML = "";
        updateButton.appendChild(document.createTextNode("Census Not Open"));
        updateButton.disabled = true;
        updateButton.onclick = () => {/*Nothing*/ };
    }
}

/**
 * Setups all of the info and restrictions surrounding whether or not a census
 * is in progress. 
 */
async function setupCensusDate() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Get the API endpoint
    const censusDateUrl = await globalThis.baseApiUrl + "census";

    // Make API call with authentication token
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };
    const apiRes = await fetch(censusDateUrl, {
        headers,
        method: "GET",
    });

    // Converting the gathered json into a casted obj
    const apiObj = await apiRes.json() as CensusDateInfoPayload;

    // Setting the current census to be what the API gave
    if (apiObj.isActive) {
        currentCensusYear = apiObj.year;
    }
    else {
        currentCensusYear = -1;
    }

    // Adjusting update modal button accordingly
    setupModalButton();
}


/**
 * Populates the drop down options with each of the plots in the arb
 */
async function createPlotOptions() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Get the API endpoint
    const plotCountUrl = await globalThis.baseApiUrl + "plot-ids";

    // Make API call with authentication token
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };
    const apiRes = await fetch(plotCountUrl, {
        headers,
        method: "GET",
    });
    const apiObj = await apiRes.json() as PlotIdsPayload;
    const plotIds: number[] = apiObj.plotIds;

    const select = document.getElementById("plot-select") as HTMLSelectElement;

    for (const plotId of plotIds) {
        const option = document.createElement('option');
        option.value = "" + plotId;
        option?.appendChild(document.createTextNode("" + plotId));
        select.appendChild(option);
    }
}



//////////// CONSTANTLY CALLED FUNCTIONS ////////////

function sortTrees() {
    // Getting the users choice
    const choice = (document.getElementById("filter-select") as HTMLSelectElement).selectedIndex;

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
async function updateSurveyTable() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Grabbing each of HTML elements to be made visible if applicable
    const addButton = document.getElementById("add-button");
    const filterButton = document.getElementById("filter-button")
    const surveyTable = document.getElementById("survey-table");
    const grayWarning = document.getElementById("gray-warning");
    if (surveyTable.style.visibility == "hidden") {
        addButton.style.visibility = "visible";
        filterButton.style.visibility = "visible";
        surveyTable.style.visibility = "visible";
        grayWarning.style.visibility = "visible";
    }

    // Getting our plot
    const select = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);


    // Get the API endpoint
    let treesUrl = await globalThis.baseApiUrl + "trees";

    // Add query options
    treesUrl += `?plot=${chosenPlot}&current_census=${currentCensusYear}`

    // Add authentication token to headers
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };

    // Make an API request for the tree entries
    const apiRes = await fetch(treesUrl, {
        headers,
        method: "GET",
    });
    const apiObj = await apiRes.json() as EntryResponsePayload[];

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
        icon.ariaLabel = "See more info on the provided tree"
        icon.setAttribute('data-bs-toggle', 'modal');
        icon.setAttribute('data-bs-target', '#pop-up');
        icon.onclick = function () { updateCurrentTree(i); }
        icon.className = "fas fa-circle-info";

        // Each other aspect of an entry
        updater.appendChild(icon);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
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


    // Adding in the ability to set which size class the tree falls into
    const sizeClass = document.createElement("select");

    const small = document.createElement("option");
    small.appendChild(document.createTextNode("Small"))
    sizeClass.appendChild(small);

    const medium = document.createElement("option");
    medium.appendChild(document.createTextNode("Medium"))
    sizeClass.appendChild(medium);

    const large = document.createElement("option");
    large.appendChild(document.createTextNode("Large"))
    sizeClass.appendChild(large);

    document.getElementById("give-size-class").appendChild(sizeClass);


    // Adjusting to POST to the API
    isNewTree = true;
}


/**
 * Sets up the modal to change information about a pre-existing tree.
 * @param index the index of the selected tree in our array of trees for the plot.
 */
function updateCurrentTree(index: number) {

    refreshPopUp();

    // Set tableItem variable for confirm update to use
    selectedTableItem = currentTrees[index];

    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + selectedTableItem.species));
    species.id = "given-species";
    document.getElementById("give-species").appendChild(species);

    const year = document.getElementById("given-date") as HTMLHeadingElement;
    year.innerHTML = "" + selectedTableItem.year;

    const tag = document.getElementById("given-tag") as HTMLInputElement;
    tag.value = "" + selectedTableItem.recentTag;

    const status = document.getElementById("given-status") as HTMLSelectElement;
    status.value = statusName.get(selectedTableItem.status);
    console.log(status.value);

    const sizeClass = document.createElement("h4");
    sizeClass.appendChild(document.createTextNode(sizeClassToName.get(selectedTableItem.sizeClass)));
    sizeClass.id = "given-size-class";
    document.getElementById("give-size-class").appendChild(sizeClass);

    const dbh = document.getElementById("given-dbh") as HTMLInputElement;
    dbh.value = "" + selectedTableItem.dbh;

    const matchNum = document.getElementById("given-match-num") as HTMLSelectElement;
    matchNum.value = "" + selectedTableItem.matchNum;

    const comment = document.getElementById("given-comment") as HTMLInputElement;
    comment.value = "" + selectedTableItem.comments;

    // Adjusting to PUT to the API
    isNewTree = false;
}

/**
 * Adding the information from a filled out survey modal to our database
 */
function confirmUpdate() {

    // Turns modal info into a tableItem by grabbing each element from the modal
    const selectPlot = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(selectPlot.options[selectPlot.selectedIndex].value);

    const treeId = selectedTableItem.treeId;

    const getSpecies = document.getElementById("give-species");
    let species: string;
    if (getSpecies.firstChild instanceof HTMLInputElement) {
        species = getSpecies.firstChild.value as string;
    }
    else if (getSpecies.firstChild instanceof HTMLHeadingElement) {
        species = getSpecies.firstChild.innerText as string;
    }

    const recentTag = parseInt((document.getElementById("given-tag") as HTMLInputElement).value);
    const status = (document.getElementById("given-status") as HTMLSelectElement).selectedIndex as state;

    const getSizeClass = document.getElementById("give-size-class");
    let sizeClass: size;
    if (getSizeClass.firstChild instanceof HTMLSelectElement) {
        sizeClass = getSizeClass.firstChild.selectedIndex as size;
    }
    else if (getSizeClass.firstChild instanceof HTMLHeadingElement) {
        sizeClass = nameToSizeClass.get(getSizeClass.firstChild.innerText);
    }

    const dbh = parseInt((document.getElementById("given-dbh") as HTMLInputElement).value) as number;
    const matchNum = ((document.getElementById("given-match-num") as HTMLSelectElement).selectedIndex) + 1;
    const comment = (document.getElementById("given-comment") as HTMLInputElement).value;

    // Ensuring no unfilled form is sent to the database
    if (dbh <= 0 || species == "") {
        onModalWarning();
    }
    else {
        offModalWarning();

        const treeForAPI = new tableItem(treeId, species, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
        // POST if a new tree, otherwise PUT
        if (isNewTree) {
            // TODO: POST request for new tree
        }
        else
            putCensusEntry(treeForAPI);

    }

}


async function putCensusEntry(item: tableItem) {
    // Convert table item to payload
    const payload: EntryPutPayload = {
        year: item.year,
        treeId: item.treeId,
        recentTag: item.recentTag,
        dbh: item.dbh,
        status: statusName[item.status],
        matchNum: item.matchNum,
        comments: item.comments,
    }

    // Get the API endpoint
    const treesUrl = await globalThis.baseApiUrl + "trees";

    // Add authentication token to headers
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };

    // Make an API request to add/update the census entry
    await fetch(treesUrl, {
        headers,
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

/**
 * Resets the survey modal.
 */
function refreshPopUp() {
    document.getElementById("give-species").innerHTML = "";
    (document.getElementById("given-date") as HTMLHeadingElement).innerText = "" + currentCensusYear;
    (document.getElementById("given-tag") as HTMLInputElement).value = "-1";
    (document.getElementById("given-status") as HTMLSelectElement).value = "Live";
    document.getElementById("give-size-class").innerHTML = "";
    (document.getElementById("given-dbh") as HTMLInputElement).value = "0";
    (document.getElementById("given-match-num") as HTMLSelectElement).value = "1";
    (document.getElementById("given-comment") as HTMLInputElement).value = "";

}


// Setting the current array to contain the values from a json file
function changeArrFromJson(censusEntries: EntryResponsePayload[]) {
    currentTrees = censusEntries.map((entry) => (new tableItem(
        entry.treeId,
        entry.species,
        entry.year,
        entry.recentTag,
        state[entry.status as keyof typeof state], // Convert status to state type
        size[entry.sizeClass as keyof typeof size], // Convert sizeClass to size type
        entry.dbh,
        entry.matchNum as match,
        entry.comments
    )));
}

// Easy toggles for the warning notices
function onModalWarning() {
    document.getElementById("submission-notice").style.visibility = "visible";
}
function offModalWarning() {
    document.getElementById("submission-notice").style.visibility = "hidden";
}



//////////// TYPES TO MAKE INFO FROM DB WORK ////////////

interface CensusDateInfoPayload {
    year: number;
    startedBy: string;
    isActive: boolean;
}

interface PlotIdsPayload {
    plotIds: number[];
}

interface EntryResponsePayload {
    treeId: number;
    species: string;
    year: number;
    recentTag: number;
    status: string;
    sizeClass: string;
    dbh: number;
    matchNum: number;
    comments: string;
}

interface EntryPutPayload {
    year: number;
    treeId: number;
    recentTag: number;
    dbh: number;
    status: string;
    matchNum: number;
    comments: string;
}

// Outline for the items themselves
class tableItem {
    treeId: number;
    species: string;
    year: number;
    recentTag: number;
    status: state;
    sizeClass: size;
    dbh: number;
    matchNum: match;
    comments: string;


    constructor(treeId: number, species: string, year: number, recentTag: number, status: state, sizeClass: size, dbh: number, matchNum: number, comment: string) {

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
enum state {
    Live,
    Sick,
    Dead,
    Fallen
}

enum size {
    Small,
    Medium,
    Large,
}

enum match {
    Definitely = 1,
    Probably = 2,
    NewTree = 3,
    OldTree = 4,
    Lost = 5,
}


// Maps to access the aspects of each tree
const statusName: Map<state, string> = new Map([
    [state.Live, "Live"],
    [state.Sick, "Sick"],
    [state.Dead, "Dead"],
    [state.Fallen, "Fallen"],
]);

const sizeClassToName: Map<size, string> = new Map([
    [size.Small, "Small"],
    [size.Medium, "Medium"],
    [size.Large, "Large"],
]);

const nameToSizeClass: Map<string, size> = new Map([
    ["Small", size.Small],
    ["Medium", size.Medium],
    ["Large", size.Large],
]);