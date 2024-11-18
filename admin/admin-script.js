var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Getting the current date
const currentYear = new Date().getFullYear();
//////////// CONSTANTLY CALLED FUNCTIONS ////////////
/**
 * Sets the text displaying whether or not a census is currently occurring.
 */
function censusStatusYearSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        // Setting up the current displayed census year
        const censusYearStatus = document.getElementById("census-status-year");
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Get the API endpoint
        const censusDateUrl = (yield globalThis.baseApiUrl) + "census";
        console.log(censusDateUrl);
        // Make API call with authentication token
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        const apiRes = yield fetch(censusDateUrl, {
            headers,
            method: "GET",
        });
        // Converting the gathered json into a casted obj
        const apiObj = yield apiRes.json();
        // Updating the indicator of the current census
        if (apiObj.isActive) {
            censusYearStatus.innerText = "Current Census: " + apiObj.year;
        }
        else {
            censusYearStatus.innerText = "Current Census: No census is actively underway";
        }
    });
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
function setNewPopUpText(turnOn, text) {
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
//# sourceMappingURL=admin-script.js.map