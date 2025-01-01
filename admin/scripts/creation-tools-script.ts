//////////// CONSTANTLY CALLED FUNCTIONS ////////////

/**
 * Creates a new account and sends it to Auth0 to be implemented.
 */
async function createNewAccount() {

    // Getting the entered fields
    let newEmail = ((document.getElementById("new-email") as HTMLInputElement).value as string);
    let newPas = ((document.getElementById("new-pas") as HTMLInputElement).value as string);

    // Removing whitespace as a factor
    newEmail = newEmail.trim().toLowerCase();
    newPas = newPas.trim();

    // Ensuring the email and password are correct
    if (await configAccountWarning(newEmail, newPas)) {
        // Construct request body
        const payload: NewUserInfo = {
            email: newEmail,
            password: newPas,
        }

        // Get the API endpoint
        const addAccUrl = await globalThis.baseApiUrl + "add-account";

        // Add content type and authorization token to headers
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${globalThis.authToken}`,
        }

        // Make an API request to create new account
        await fetch(addAccUrl, {
            headers,
            method: "POST",
            body: JSON.stringify(payload)
        });

        // Clearing out modal's input boxes
        (document.getElementById("new-email") as HTMLInputElement).value = "";
        (document.getElementById("new-pas") as HTMLInputElement).value = "KArbPassword123";
    }
}


/**
 * Grabs a new entered plot number and sends it to the data base.
 */
async function createNewPlot() {

    // Getting the entered plot number
    let newPlot = parseFloat((document.getElementById("new-plot") as HTMLInputElement).value);

    // Getting the land cover type
    let coverType = (document.getElementById("new-cover-type") as HTMLInputElement).value as string;
    coverType = coverType.trim();

    // For clarity, showing that the focal tree tree-id will be null
    let focalTreeID = null;

    // Ensuring the same plot doesn't already exist
    if (await configPlotWarning(newPlot, coverType)) {
        // Wait for auth token to be ready and get API endpoint
        await globalThis.authTokenReady;
        const plotIdUrl = await globalThis.baseApiUrl + "plot-ids";

        // Create a new plot object
        const plotValues: NewPlotValues = {
            plotId: newPlot,
            landCoverType: coverType,
            focalTree: focalTreeID,
        }

        // Make API call with authentication token
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        const apiRes = await fetch(plotIdUrl, {
            body: JSON.stringify(plotValues),
            headers,
            method: "POST",
        });
        if (!apiRes.ok) throw new Error("Error during plot creation request: " + await apiRes.text());

        // Clearing out modal's input boxes
        (document.getElementById("new-plot") as HTMLInputElement).value = "";
        (document.getElementById("new-cover-type") as HTMLInputElement).value = "";
    }

}

/**
 * Grabs a new inserted tree species and sends it to the data base.
 */
async function createNewTreeSpecies() {

    // Getting the new tree species
    let newTree = (document.getElementById("new-tree") as HTMLInputElement).value as string;

    // Removing random capitalization and whitespace as a factor
    newTree = newTree.toLowerCase().trim();

    /*
    Making the first letter of each word capitalized with regex
        For context and future debugging, the regex statement is comprised of:
        "/ /g" => the inside escape characters are global and as such continuously looked for
        "\b" => looking for a only the starting characters (boundary chars) and...
        "\w" => looking at every word character
    */
    newTree = newTree.replace(/\b\w/g, (firstLetter: string) => firstLetter.toUpperCase());


    // Ensuring the same plot doesn't already exist
    if (await configTreeWarning(newTree)) {
        // TODO: Post request to the DB with the new tree species

        // Testing
        console.log(newTree);

        // Clearing out modal's input box
        (document.getElementById("new-tree") as HTMLInputElement).value = "";
    }

}


/**
 * Checks if the provided account credentials are valid giving a warning if not.
 * @param email The potential email for a new user
 * @param password The potential password for a new user
 * @returns Gives whether or not its ok to use the specified account credentials
 */
async function configAccountWarning(email: string, password: string) {

    // Getting this modals warning label
    const warning: HTMLElement = document.getElementById("account-warning");

    // Ensuring both an email and password were provided
    if (email === "" || password === "") {
        warning.style.visibility = "visible";
        return false;
    }
    else {
        warning.style.visibility = "hidden";
        return true;
    }

}



/**
 * Checks if a plot number is valid and gives a warning if not.
 * @param plot The plot id the user is trying to enter into the database
 * @returns Gives whether or not if its ok to use the specified plot number 
 */
async function configPlotWarning(plot: number, coverType: string): Promise<boolean> {

    // Getting this modals warning label
    const warning: HTMLElement = document.getElementById("plot-warning");

    // Ensuring a number was entered
    if (Number.isNaN(plot)) {
        warning.innerHTML = "";
        warning.appendChild(document.createTextNode("Invalid plot number: entered plot has no value"));
        warning.style.visibility = "visible";
        return false;
    }

    // Ensuring a land cover type was entered
    if (coverType === "") {
        warning.innerHTML = "";
        warning.appendChild(document.createTextNode("Invalid cover type: entered type has no value"));
        warning.style.visibility = "visible";
        return false;
    }

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
    if (binSearchFound) {
        warning.innerHTML = "";
        warning.appendChild(document.createTextNode("Invalid plot number: entered plot already exists"));
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
 * @returns Gives whether or not its ok to use the specified tree species
 */
async function configTreeWarning(species: string): Promise<boolean> {

    // Getting this modals warning label
    const warning: HTMLElement = document.getElementById("tree-warning");

    // Ensuring something was entered
    if (species === "") {
        warning.innerHTML = "";
        warning.appendChild(document.createTextNode("Invalid species: provided tree name has no value"));
        warning.style.visibility = "visible";
        return false;
    }

    //TODO: Make this an API call where you get each of the trees species

    // TEMP hard coded trees for testing
    const allSpecies: string[] = ["American Elm", "Beech", "Bitternut Hickory", "Black Cherry", "Black Locust", "Black Oak", "Dogwood", "Hickory", "Maple", "Oak", "Red Maple", "Red Oak", "Red Pine", "Sassafras", "Shagbark Hickory", "Sugar Maple", "Unknown", "White Oak", "White Pine"];

    // Checking if the user entered number is within the existing plots
    let binSearchFound = await genericBinarySearch(allSpecies, species, 0, allSpecies.length - 1);

    // Setting a warning if applicable
    if (binSearchFound) {
        warning.innerHTML = "";
        warning.appendChild(document.createTextNode("Invalid species: given tree is already an option"));
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


//////////// TYPES TO MAKE INFO FROM DB WORK ////////////

interface NewUserInfo {
    email: string;
    password: string;
}

interface NewPlotValues {
    plotId: number;
    landCoverType: string;
    focalTree: string;
}