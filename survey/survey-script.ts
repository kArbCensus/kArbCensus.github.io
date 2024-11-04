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
    const addButton = document.getElementById("add-button");
    const surveyTable = document.getElementById("survey-table");

    // Making the survey visible
    if (surveyTable.style.visibility == "hidden") {
        addButton.style.visibility = "visible";
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

        // The view button
        let updater = document.createElement('td');
        let button = document.createElement('button');
        updater.style.width = "16%";
        updater.style.minWidth = "150px";
        button.id = "table-button";
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#pop-up');
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


// Setting the current array to contain the values from a json file
function changeArrFromJson(/*JSON objs goes in here*/) {
    //cats over the json strings with its attributes into the custom class
    //each obj into the array 
    currentTrees = [new tableItems(), new tableItems(), new tableItems(), new tableItems(), new tableItems(), new tableItems()];
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
    year: number;

    constructor() {
        this.year = 2025
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
