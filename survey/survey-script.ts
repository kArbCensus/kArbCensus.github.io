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
    const apiObj = await apiRes.json() as CensusStatus;

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

    // Getting our plot
    const select = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);

    // Grabbing each of HTML elements to be made visible if applicable
    const addButton = document.getElementById("add-button");
    const filterButton = document.getElementById("filter-button")
    const surveyTable = document.getElementById("survey-table");
    const grayWarning = document.getElementById("gray-warning");
    if (chosenPlot != -1) {
        addButton.style.visibility = "visible";
        filterButton.style.visibility = "visible";
        surveyTable.style.visibility = "visible";
        grayWarning.style.visibility = "visible";
    }
    else
    {
        addButton.style.visibility = "hidden";
        filterButton.style.visibility = "hidden";
        surveyTable.style.visibility = "hidden";
        grayWarning.style.visibility = "hidden";
    }


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


// TODO: have this be an API call to get all the registered API names
function populateSpecies(dropDown: HTMLSelectElement) {
    // TEMPORARILY hard coding in each tree
    const americanElm = document.createElement("option");
    americanElm.value = "American Elm";
    americanElm.appendChild(document.createTextNode("American Elm"));
    dropDown.appendChild(americanElm);

    const beech = document.createElement("option");
    beech.value = "Beech";
    beech.appendChild(document.createTextNode("Beech"));
    dropDown.appendChild(beech);

    const bitternutHickory = document.createElement("option");
    bitternutHickory.value = "Bitternut Hickory";
    bitternutHickory.appendChild(document.createTextNode("Bitternut Hickory"));
    dropDown.appendChild(bitternutHickory);

    const blackCherry = document.createElement("option");
    blackCherry.value = "Black Cherry";
    blackCherry.appendChild(document.createTextNode("Black Cherry"));
    dropDown.appendChild(blackCherry);

    const blackLocust = document.createElement("option");
    blackLocust.value = "Black Locust";
    blackLocust.appendChild(document.createTextNode("Black Locust"));
    dropDown.appendChild(blackLocust);

    const blackOak = document.createElement("option");
    blackOak.value = "Black Oak";
    blackOak.appendChild(document.createTextNode("Black Oak"));
    dropDown.appendChild(blackOak);

    const dogwood = document.createElement("option");
    dogwood.value = "Dogwood";
    dogwood.appendChild(document.createTextNode("Dogwood"));
    dropDown.appendChild(dogwood);

    const hickory = document.createElement("option");
    hickory.value = "Hickory";
    hickory.appendChild(document.createTextNode("Hickory"));
    dropDown.appendChild(hickory);

    const maple = document.createElement("option");
    maple.value = "Maple";
    maple.appendChild(document.createTextNode("Maple"));
    dropDown.appendChild(maple);

    const oak = document.createElement("option");
    oak.value = "Oak";
    oak.appendChild(document.createTextNode("Oak"));
    dropDown.appendChild(oak);

    const redMaple = document.createElement("option");
    redMaple.value = "Red Maple";
    redMaple.appendChild(document.createTextNode("Red Maple"));
    dropDown.appendChild(redMaple);

    const redOak = document.createElement("option");
    redOak.value = "Red Oak";
    redOak.appendChild(document.createTextNode("Red Oak"));
    dropDown.appendChild(redOak);

    const redPine = document.createElement("option");
    redPine.value = "Red Pine";
    redPine.appendChild(document.createTextNode("Red Pine"));
    dropDown.appendChild(redPine);

    const sassafras = document.createElement("option");
    sassafras.value = "Sassafras";
    sassafras.appendChild(document.createTextNode("Sassafras"));
    dropDown.appendChild(sassafras);

    const shagbarkHickory = document.createElement("option");
    shagbarkHickory.value = "Shagbark Hickory";
    shagbarkHickory.appendChild(document.createTextNode("Shagbark Hickory"));
    dropDown.appendChild(shagbarkHickory);

    const sugarMaple = document.createElement("option");
    sugarMaple.value = "Sugar Maple";
    sugarMaple.appendChild(document.createTextNode("Sugar Maple"));
    dropDown.appendChild(sugarMaple);

    const unknown = document.createElement("option");
    unknown.value = "Unknown";
    unknown.appendChild(document.createTextNode("Unknown"));
    dropDown.appendChild(unknown);

    const whiteOak = document.createElement("option");
    whiteOak.value = "White Oak";
    whiteOak.appendChild(document.createTextNode("White Oak"));
    dropDown.appendChild(whiteOak);

    const whitePine = document.createElement("option");
    whitePine.value = "White Pine";
    whitePine.appendChild(document.createTextNode("White Pine"));
    dropDown.appendChild(whitePine);
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
async function confirmUpdate() {
    // Resetting for the new submission
    offModalWarning();

    // Turns modal info into a tableItem by grabbing each element from the modal
    const selectPlot = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(selectPlot.options[selectPlot.selectedIndex].value);

    const getSpecies = document.getElementById("give-species");
    let treeSpecies: string;
    if (getSpecies.firstChild instanceof HTMLSelectElement) {
        treeSpecies = getSpecies.firstChild.options[getSpecies.firstChild.selectedIndex].value;
    }
    else if (getSpecies.firstChild instanceof HTMLHeadingElement) {
        treeSpecies = getSpecies.firstChild.innerText as string;
    }

    const recentTag = parseFloat((document.getElementById("given-tag") as HTMLInputElement).value);
    const status = (document.getElementById("given-status") as HTMLSelectElement).selectedIndex as state;

    const getSizeClass = document.getElementById("give-size-class");
    let sizeClass: size;
    if (getSizeClass.firstChild instanceof HTMLSelectElement) {
        sizeClass = getSizeClass.firstChild.selectedIndex as size;
    }
    else if (getSizeClass.firstChild instanceof HTMLHeadingElement) {
        sizeClass = nameToSizeClass.get(getSizeClass.firstChild.innerText);
    }

    const dbh = parseFloat((document.getElementById("given-dbh") as HTMLInputElement).value) as number;
    const matchNum = ((document.getElementById("given-match-num") as HTMLSelectElement).selectedIndex) + 1;
    const comment = (document.getElementById("given-comment") as HTMLInputElement).value;

    // Ensuring no clearly inaccurate data isn't sent to the database
    if (configModalWarning(recentTag, dbh)) {
        offModalWarning();

        const treeForAPI = new tableItem(-1, treeSpecies, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
        // POST if a new tree, otherwise PUT
        if (isNewTree) {
            await postNewTree(treeForAPI, chosenPlot);
        }
        else {
            treeForAPI.treeId = selectedTableItem.treeId;
            await putCensusEntry(treeForAPI);
        }

        // Refresh survey table after update
        updateSurveyTable();
    }
}

async function postNewTree(item: tableItem, plotId: number) {
    // Convert table item to payload
    const payload: TreePostPayload = {
        species: item.species,
        sizeClass: sizeClassToName.get(item.sizeClass),
        plotId: plotId,
        year: item.year,
        recentTag: item.recentTag,
        dbh: item.dbh,
        status: statusName.get(item.status),
        matchNum: item.matchNum,
        comments: item.comments,
    };

    // Get the API endpoint
    const treesUrl = await globalThis.baseApiUrl + "trees";

    // Add authentication token to headers
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };

    // Make an API request to add/update the census entry
    await fetch(treesUrl, {
        headers,
        method: "POST",
        body: JSON.stringify(payload)
    });
}

async function putCensusEntry(item: tableItem) {
    // Convert table item to payload
    const payload: EntryPutPayload = {
        year: item.year,
        treeId: item.treeId,
        recentTag: item.recentTag,
        dbh: item.dbh,
        status: statusName.get(item.status),
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
        nameToSizeClass.get(entry.sizeClass), // Convert sizeClass to size type
        entry.dbh,
        entry.matchNum as match,
        entry.comments
    )));
}


/**
 * Checks if any warning needs to be displayed for the modal based on the user's input.
 * @param tag The most recent tag for a provided tree
 * @param dbh The DBH for a provided tree
 * @returns Whether their is any issues in the possible submission parameters for the modal
 */
function configModalWarning(tag: number, dbh: number): boolean {
    let isFine: boolean = true;

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



//////////// TYPES TO MAKE INFO FROM DB WORK ////////////

interface CensusStatus {
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

interface TreePostPayload {
    species: string;
    sizeClass: string;
    plotId: number;
    year: number;
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