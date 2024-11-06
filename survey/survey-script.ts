// All of the trees for a chosen plot
let currentTrees = new Array<tableItem>();



//////////// LOAD IN PAGE FUNCTIONS ////////////



// Populating the plot drop down
function createPlotOptions() {

    const select = document.getElementById("plot-select") as HTMLSelectElement;

    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (let i = 1; i < 41; i++) {
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
        button.onclick = function () { updateCurrentTree(i); }
        button.appendChild(document.createTextNode("Info"))

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

}

function createNewTree() {

    clearVaryingTypedTags();

    const species = document.createElement("input");
    species.style.textAlign = "left";
    document.getElementById("give-species").appendChild(species);

    const year = document.createElement("input");
    year.type = "number";
    document.getElementById("give-date").appendChild(year);

    // Resets the modal to take in new info

}

function updateCurrentTree(placement: number) {

    clearVaryingTypedTags();

    const toUpdate = currentTrees[placement];

    const species = document.createElement("h4");
    species.appendChild(document.createTextNode("" + toUpdate.species));
    document.getElementById("give-species").appendChild(species);

    const year = document.createElement("h4");
    year.appendChild(document.createTextNode("" + toUpdate.year));
    document.getElementById("give-date").appendChild(year);

    // Transfer info from array into modal

    console.log("Test: " + placement);

}

// How createNewTree() and updateCurrentTree(placement: number) actually add to our db
function confirmUpdate() {
    // Turns modal info into a tableItem

    // Sends tableItem to the API

    // Refreshes the page
}

function clearVaryingTypedTags() {
    document.getElementById("give-species").innerHTML = "";
    document.getElementById("give-date").innerHTML = "";
}


// Setting the current array to contain the values from a json file
function changeArrFromJson(/*JSON objs goes in here*/) {
    //cats over the json strings with its attributes into the custom class
    //each obj into the array 
    currentTrees = [new tableItem(), new tableItem(), new tableItem(), new tableItem(), new tableItem(), new tableItem()];
}



//////////// CLASS TO MAKE INFO FROM DB WORK ////////////


// Outline for the items themselves
class tableItem {
    plotId: number;
    species: string;
    recentTag: number;
    status: state;
    DBH: number;
    comments: string;
    treeSize: size;
    matchNum: match;
    year: number;

    constructor() {
        this.year = 2025
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
    Definitely,
    Probably,
    NewTree,
    OldTree,
    Lost,
}


