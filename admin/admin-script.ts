// Getting the current date
const currentYear = new Date().getFullYear();


//////////// CONSTANTLY CALLED FUNCTIONS ////////////



/**
 * Sets the text displaying whether or not a census is currently occurring.
 */
async function censusStatusYearSetup() {

    // Setting up the current displayed census year
    const censusYearStatus = document.getElementById("census-status-year")

    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Get the API endpoint
    const censusDateUrl = await globalThis.baseApiUrl + "census";

    console.log(censusDateUrl);

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

    // Updating the indicator of the current census
    if(apiObj.isActive)
    {
        censusYearStatus.innerText = "Current Census: " + apiObj.year;
    }
    else
    {
        censusYearStatus.innerText = "Current Census: No census is actively underway";
    }
    
}


/**
 * Ensures that the user wants to create a new census via model.
 */
function confirmCreateNewCensus() {
    setNewPopUpText(true, "Are you sure you want to start a new census for the year: " + currentYear);
}


/**
 * Ensures that the user wants to end a census via model.
 */
function confirmEndCurrentCensus() {
    setNewPopUpText(false, "Are you sure you want to end the current census.");
}


/**
 * Utility function to adjust the text and functionality of a model to
 * match the user's chosen option.
 */
function setNewPopUpText(turnOn: boolean, text: string) {
    const popUp = document.getElementById("pop-up-text");
    popUp.innerHTML = "";
    popUp.appendChild(document.createTextNode(text));

    const update = document.getElementById("pop-up-update");
    if (turnOn) {
        update.onclick = function () { startCensus(); };
    }
    else {
        update.onclick = function () { endCensus(); };
    }
}


/**
 * Tells the API to start a new census.
 */
function startCensus() {
    //TODO: Implement an API call to start a census

    // Refreshing for updated status text
    location.reload();
}


/**
 * Tells the API to end the current census.
 */
function endCensus() {
    //TODO: Implement an API call to end a census

    // Refreshing for updated status text
    location.reload();
}




//////////// TYPES TO MAKE INFO FROM DB WORK ////////////



interface CensusDateInfoPayload {
    year: number;
    startedBy: string;
    isActive: boolean;
}