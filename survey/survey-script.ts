// All of the trees for a chosen plot
let currentTrees = new Array<tableItem>();
//TODO: MAKE THIS AN API CALL TO GET THE REAL CURRENT YEAR!
const currentCensusYear = 2025;



//////////// LOAD IN PAGE FUNCTIONS ////////////

function setupSurvey()
{
    createPlotOptions()
}

// Populating the plot drop down
async function createPlotOptions() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Get the API endpoint
    const configRes = await fetch("/api_config.json");
    const { urlBase } = await configRes.json() as {urlBase: string};
    const plotCountUrl = urlBase + "plot-count";
    
    // Make API call with authentication token
    const headers = {
        "Authorization": `Bearer ${globalThis.authToken}`
    };
    const apiRes = await fetch(plotCountUrl, {
        headers,
        method: "GET",
    });
    const apiObj = await apiRes.json() as {value: number};
    const plotCount: number = apiObj.value;

    const select = document.getElementById("plot-select") as HTMLSelectElement;

    // TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (let i = 1; i <= plotCount; i++) {
        const option = document.createElement('option');
        option.value = "" + i;
        option?.appendChild(document.createTextNode("" + i));
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
    const select = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);


    //TODO: Use API to get a JSON file for the provided plot
    changeArrFromJson(/*JSON obj goes in here*/);



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
        icon.onclick = function () { updateCurrentTree(i); }
        icon.className = "fas fa-circle-info";

        // Each other aspect of an entry
        updater.appendChild(icon);
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode("" + tree.sizeClass));
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


function updateCurrentTree(placement: number) {

    clearTags();

    // Transfer info from array into modal
    const toUpdate = currentTrees[placement];

    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
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
    dbh.value = "" + currentTrees[placement].DBH;

    const matchNum = document.getElementById("given-match-num") as HTMLSelectElement;
    matchNum.value = "" + currentTrees[placement].matchNum;

    const comment = document.getElementById("given-comment") as HTMLInputElement;
    comment.value = "" + currentTrees[placement].comments;

}

// How createNewTree() and updateCurrentTree(placement: number) actually add to our db
function confirmUpdate() {
    // Turns modal info into a tableItem
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
    (document.getElementById("given-date") as HTMLHeadingElement).innerText = "" + currentCensusYear;
    (document.getElementById("given-tag") as HTMLInputElement).value = "-1";
    (document.getElementById("given-status") as HTMLSelectElement).value = "Alive";
    (document.getElementById("given-size-class") as HTMLSelectElement).value = "Small";
    (document.getElementById("given-dbh") as HTMLInputElement).value = "0";
    (document.getElementById("given-match-num") as HTMLSelectElement).value = "1";
    (document.getElementById("given-comment") as HTMLInputElement).value = "";
}


// Setting the current array to contain the values from a json file
function changeArrFromJson(/*JSON objs goes in here*/) {

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
    plotId: number;
    species: string;
    year: number;
    recentTag: number;
    status: state;
    sizeClass: size;
    DBH: number;
    matchNum: match;
    comments: string;


    constructor(plotId: number, species: string, year: number, recentTag: number, status: state, sizeClass: size, DBH: number, matchNum: number, comment: string) {

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