// All of the trees for a chosen plot
let currentTrees = new Array<tableItems>();

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


// Updating the table for a new plot choice
function updateSurveyTable() {
    const surveyTable = document.getElementById("survey-table");

    if (surveyTable.style.visibility == "hidden") {
        surveyTable.style.visibility = "visible";
    }

    // Getting our plot
    const select = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(select.options[select.selectedIndex].value);


    //TODO: Use API to get a JSON file for the provided plot

    changeArrFromJson(/*JSON file goes in here*/);


    //Clear out the current items in the table
    const body = document.getElementById("table-body");
    body.innerHTML = '';

    // Adds the new items to the body
    for (let i = 0; i < currentTrees.length; i++) {
        let newRow = document.createElement('tr');
        newRow.id = "" + i;

        let tree = currentTrees[i];

        let updater = document.createElement('td');
        updater.appendChild(document.createTextNode("Button here!"));
        let tag = document.createElement('td');
        tag.appendChild(document.createTextNode("" + tree.recentTag));
        let size = document.createElement('td');
        size.appendChild(document.createTextNode("" + tree.treeSize));
        let species = document.createElement('td');
        species.appendChild(document.createTextNode("" + tree.species));

        newRow.appendChild(updater);
        newRow.appendChild(tag);
        newRow.appendChild(size);
        newRow.appendChild(species);

        body.appendChild(newRow);
    }

}


// Setting the current array to contain the values from a json file
function changeArrFromJson(/*JSON file goes in here*/) {
    currentTrees = [new tableItems(), new tableItems()];
}



// Class for storing objects to represent a tree from the DB
class tableItems {
    plotId: number;
    species: string;
    recentTag: number;
    status: string;
    DBH: number;
    comments: string;
    treeSize: size;
    matchNum: match;

    constructor() {

    }
}

// Aspects of trees
enum size {
    small,
    medium,
    big,
}

enum match {
    definitely,
    probably,
    newTree,
    oldTree,
    lost,
}
