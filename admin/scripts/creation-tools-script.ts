//////////// CONSTANTLY CALLED FUNCTIONS ////////////

/**
 * Creates a new account and sends it to Auth0 to be implemented.
 */
async function createNewAccount() {

    // Getting the entered fields
    let newEmail = (document.getElementById("new-email") as HTMLInputElement).value as string;
    let newPas = (document.getElementById("new-pas") as HTMLInputElement).value as string;

    //TODO: Should there be a check here if the password is already in use?

    //TODO: Post request to give Auth0 a new account

    // User feedback via a reload
    location.reload();

}


/**
 * Grabs a new entered plot number and sends it to the data base.
 */
async function createNewPlot() {

    // Getting the entered plot number
    let newPlot = parseFloat((document.getElementById("new-plot") as HTMLInputElement).value);

    // Ensuring the same plot doesn't already exist
    if (configPlotWarning(newPlot)) {
        // TODO: Post request to the DB with the new plot number

        // Testing
        console.log(newPlot);

        // User feedback via a reload
        //location.reload();
    }

}

/**
 * Grabs a new inserted tree species and sends it to the data base.
 */
function createNewTreeSpecies() {

    // Getting the new tree species
    let newTree = (document.getElementById("new-tree") as HTMLInputElement).value as string;


    // Ensuring the same plot doesn't already exist
    if (configTreeWarning(newTree)) {
        // TODO: Post request to the DB with the new tree species

        // Testing
        console.log(newTree);

        // User feedback via a reload
        //location.reload();
    }

}


//TODO: Config to check/set warning for new plot
async function configPlotWarning(plot: number): Promise<boolean> {

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

    
    // Checking if the user entered number is within the existing plots
    let binSearchPassed = false;

    // Setting a warning if applicable
    const warning: HTMLElement = document.getElementById("plot-warning");
    if (!binSearchPassed) {
        warning.style.visibility = "visible";
    }
    else{
        warning.style.visibility = "hidden";
    }

    return binSearchPassed;
}


//TODO: Config to check/set warning for new species
async function configTreeWarning(species: string): Promise<boolean> {

    //TODO: Make this an API call where you get each of the trees species

    // TEMP hard coded trees for testing
    const allSpecies: string[] = ["American Elm", "Beech", "Bitternut Hickory", "Black Cherry", "Black Locust", "Black Oak", "Dogwood", "Hickory", "Maple", "Oak", "Red Maple", "Red Oak", "Red Pine", "Sassafras", "Shagbark Hickory", "Sugar Maple", "Unknown", "White Oak", "White Pine"];

    // Checking if the user entered number is within the existing plots
    let binSearchPassed = false;

    // Setting a warning if applicable
    const warning: HTMLElement = document.getElementById("tree-warning");
    if (!binSearchPassed) {
        warning.style.visibility = "visible";
    }
    else{
        warning.style.visibility = "hidden";
    }
    return binSearchPassed;

}



//TODO: event listener to turn off all modal warnings if a modal is hidden


// Refresh page on submission?
// Since the survey shows your added tree, it has fine user feedback.
// But here I feel a page refresh would assure me I did something

//////////// TYPES TO MAKE INFO FROM DB WORK ////////////
