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
    //location.reload();

}


/**
 * Grabs a new entered plot number and sends it to the data base.
 */
async function createNewPlot() {

    // Getting the entered plot number
    let newPlot = parseFloat((document.getElementById("new-plot") as HTMLInputElement).value);

    // Ensuring the same plot doesn't already exist
    if (await configPlotWarning(newPlot)) {
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
async function createNewTreeSpecies() {

    // Getting the new tree species
    let newTree = (document.getElementById("new-tree") as HTMLInputElement).value as string;


    // Ensuring the same plot doesn't already exist
    if (await configTreeWarning(newTree)) {
        // TODO: Post request to the DB with the new tree species

        // Testing
        console.log(newTree);

        // User feedback via a reload
        //location.reload();
    }

}


/**
 * Checks if a plot number an admin wants to enter is valid and gives them a warning if not.
 * @param plot The plot id the user is trying to enter into the database
 * @returns Gives whether or not users its ok to use the specified plot number 
 */
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
    let binSearchFound = await genericBinarySearch(plotIds, plot, 0, plotIds.length - 1);

    // Setting a warning if applicable
    const warning: HTMLElement = document.getElementById("plot-warning");
    if (binSearchFound) {
        warning.style.visibility = "visible";
        return false;
    }
    else {
        warning.style.visibility = "hidden";
        return true;
    }
}


/**
 * Checks if a tree species the user wants to enter is valid and gives them a warning if not.
 * @param species The tree name the user is trying to enter into the database
 * @returns Gives whether or not users its ok to use the specified tree species
 */
async function configTreeWarning(species: string): Promise<boolean> {

    // Removing capitalization and whitespace as a factor
    species = species.toLowerCase().trim();

    //TODO: Make this an API call where you get each of the trees species
    // Make the API call convert trees to all upper case or all lower case

    // TEMP hard coded trees for testing
    const allSpecies: string[] = ["american elm", "beech", "bitternut hickory", "black cherry", "black locust", "black oak", "dogwood", "hickory", "maple", "oak", "red maple", "red oak", "red pine", "sassafras", "shagbark hickory", "sugar maple", "unknown", "white oak", "white pine"];

    // Checking if the user entered number is within the existing plots
    let binSearchFound = await genericBinarySearch(allSpecies, species, 0, allSpecies.length - 1);

    // Setting a warning if applicable
    const warning: HTMLElement = document.getElementById("tree-warning");
    if (binSearchFound) {
        warning.style.visibility = "visible";
        return false;
    }
    else {
        warning.style.visibility = "hidden";
        return true;
    }


}

/**
 * A recursive generic binary search for quick searches of select items within
 * the array's provided by the API.
 * @param array The array to conduct the binary search on
 * @param lookFor The item we are searching for within the array
 * @param start Which index of the array to start looking at
 * @param end Which index of the array to end looking at
 * @returns Whether or not the item could be found
 */
async function genericBinarySearch<T extends any>(array: T[], lookFor: T, start: number, end: number): Promise<boolean> {

    // Base case for it the binary search failed
    if (start > end) {
        return false;
    }

    // The search continues
    else {

        let middle = Math.round((start + end) / 2);

        // Seeing if the item has been found
        if (lookFor == array[middle]) {
            return true;
        }

        // Narrowing down the search by half
        else if (lookFor < array[middle]) {
            return await genericBinarySearch(array, lookFor, start, middle - 1)
        }
        else {
            return await genericBinarySearch(array, lookFor, middle + 1, end)
        }

    }
}


//TODO: create an event listener that makes update buttons work when pulled up and disabled when clicked
// (If this isn't done, you can just spam the enter button to have this happen a ton of times cause async)

//////////// TYPES TO MAKE INFO FROM DB WORK ////////////
