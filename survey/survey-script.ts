// All of the trees for a chosen plot
let currentTrees = new Array<tableItem>();

//TODO: MAKE THIS AN API CALL TO GET THE REAL CURRENT YEAR!
const currentCensusYear = -1 as number;



async function getApiUrlBase(): Promise<string> {
    const configRes = await fetch("/api_config.json");
    const { urlBase } = await configRes.json() as { urlBase: string };
    return urlBase;
}



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
 * Populates the drop down options with each of the plots in the arb
 */
async function createPlotOptions() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Get the API endpoint
    const plotCountUrl = await getApiUrlBase() + "plot-ids";

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



/**
 * Based on the currently selected plot chose, updates the potential
 * options within the survey table.
 */
async function updateSurveyTable() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

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
    const select = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);


    // Get the API endpoint
    let treesUrl = await getApiUrlBase() + "trees";

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

}


/**
 * Sets up the modal to change information about a pre-existing tree.
 * @param placement the index of the selected tree in our array of trees for the plot.
 */
function updateCurrentTree(placement: number) {

    refreshPopUp();

    // Transfer info from array into modal
    const toUpdate = currentTrees[placement];
    // Set tableItem variable for confirm update to use

    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
    species.id = "given-species";
    document.getElementById("give-species").appendChild(species);

    const year = document.getElementById("given-date") as HTMLHeadingElement;
    year.innerHTML = "" + currentTrees[placement].year;

    const tag = document.getElementById("given-tag") as HTMLInputElement;
    tag.value = "" + currentTrees[placement].recentTag;

    const status = document.getElementById("given-status") as HTMLSelectElement;
    status.value = statusName.get(currentTrees[placement].status);
    console.log(status.value);

    const sizeClass = document.getElementById("given-size-class") as HTMLSelectElement;
    sizeClass.value = sizeClassName.get(currentTrees[placement].sizeClass);

    const dbh = document.getElementById("given-dbh") as HTMLInputElement;
    dbh.value = "" + currentTrees[placement].dbh;

    const matchNum = document.getElementById("given-match-num") as HTMLSelectElement;
    matchNum.value = "" + currentTrees[placement].matchNum;

    const comment = document.getElementById("given-comment") as HTMLInputElement;
    comment.value = "" + currentTrees[placement].comments;

}

/**
 * Adding the information from a filled out survey modal to our database
 */
function confirmUpdate() {

    // Turns modal info into a tableItem by grabbing each element from the modal
    const selectPlot = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(selectPlot.options[selectPlot.selectedIndex].value);

    const getSpecies = document.getElementById("give-species");
    let species = "";
    if (getSpecies.firstChild instanceof HTMLInputElement) {
        species = getSpecies.firstChild.value as string;
    }
    else if (getSpecies.firstChild instanceof HTMLHeadingElement) {
        species = getSpecies.firstChild.innerText as string;
    }

    const recentTag = parseInt((document.getElementById("given-tag") as HTMLInputElement).value);
    const status = (document.getElementById("given-status") as HTMLSelectElement).selectedIndex as state;
    const sizeClass = (document.getElementById("given-size-class") as HTMLSelectElement).selectedIndex as size;
    const dbh = parseInt((document.getElementById("given-dbh") as HTMLInputElement).value) as number;
    const matchNum = ((document.getElementById("given-match-num") as HTMLSelectElement).selectedIndex) + 1;
    const comment = (document.getElementById("given-comment") as HTMLInputElement).value;

    // Ensuring no unfilled form is sent to the database
    if (dbh <= 0 || species == "") {
        onModalWarning();
    }
    else {
        offModalWarning();

        // Use a boolean to decide whether to PUT or POST


        // TODO: Get put treeId instead of chosenPlot
        const treeToAPI = new tableItem(chosenPlot, species, currentCensusYear, recentTag, status, sizeClass, dbh, matchNum, comment);
        //TODO: Sends tableItem to the API
        currentTrees.push(treeToAPI); //TESTING FOR RN
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
    const treesUrl = await getApiUrlBase() + "trees";

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
    (document.getElementById("given-status") as HTMLSelectElement).value = "Alive";
    (document.getElementById("given-size-class") as HTMLSelectElement).value = "Small";
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
    Alive,
    Sick,
    Dead,
    Fallen
}

enum size {
    Small,
    Medium,
    Big,
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
    [state.Alive, "Alive"],
    [state.Sick, "Sick"],
    [state.Dead, "Dead"],
    [state.Fallen, "Fallen"],
]);

const sizeClassName: Map<size, string> = new Map([
    [size.Small, "Small"],
    [size.Medium, "Medium"],
    [size.Big, "Big"],
]);