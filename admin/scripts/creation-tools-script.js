//////////// CONSTANTLY CALLED FUNCTIONS ////////////
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Creates a new account and sends it to Auth0 to be implemented.
 */
function createNewAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the entered fields
        let newEmail = document.getElementById("new-email").value;
        let newPas = document.getElementById("new-pas").value;
        //TODO: Should there be a check here if the password is already in use?
        //TODO: Post request to give Auth0 a new account
        // User feedback via a reload
        //location.reload();
    });
}
/**
 * Grabs a new entered plot number and sends it to the data base.
 */
function createNewPlot() {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the entered plot number
        let newPlot = parseFloat(document.getElementById("new-plot").value);
        // Ensuring the same plot doesn't already exist
        if (yield configPlotWarning(newPlot)) {
            // TODO: Post request to the DB with the new plot number
            // Testing
            console.log(newPlot);
            // User feedback via a reload
            //location.reload();
        }
    });
}
/**
 * Grabs a new inserted tree species and sends it to the data base.
 */
function createNewTreeSpecies() {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting the new tree species
        let newTree = document.getElementById("new-tree").value;
        // Ensuring the same plot doesn't already exist
        if (yield configTreeWarning(newTree)) {
            // TODO: Post request to the DB with the new tree species
            // Testing
            console.log(newTree);
            // User feedback via a reload
            //location.reload();
        }
    });
}
/**
 * Checks if a plot number an admin wants to enter is valid and gives them a warning if not.
 * @param plot The plot id the user is trying to enter into the database
 * @returns Gives whether or not users plot number is already in use
 */
function configPlotWarning(plot) {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for auth token to be ready
        yield globalThis.authTokenReady;
        // Get the API endpoint
        const plotCountUrl = (yield globalThis.baseApiUrl) + "plot-ids";
        // Make API call with authentication token
        const headers = {
            "Authorization": `Bearer ${globalThis.authToken}`
        };
        const apiRes = yield fetch(plotCountUrl, {
            headers,
            method: "GET",
        });
        const apiObj = yield apiRes.json();
        const plotIds = apiObj.plotIds;
        // Checking if the user entered number is within the existing plots
        let binSearchPassed = yield genericBinarySearch(plotIds, plot);
        // Setting a warning if applicable
        const warning = document.getElementById("plot-warning");
        if (!binSearchPassed) {
            warning.style.visibility = "visible";
        }
        else {
            warning.style.visibility = "hidden";
        }
        return binSearchPassed;
    });
}
/**
 * Checks if a tree species the user wants to enter is valid and gives them a warning if not.
 * @param species The tree name the user is trying to enter into the database
 * @returns Gives whether or not users species name is already in use
 */
function configTreeWarning(species) {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO: Make this an API call where you get each of the trees species
        // TEMP hard coded trees for testing
        const allSpecies = ["American Elm", "Beech", "Bitternut Hickory", "Black Cherry", "Black Locust", "Black Oak", "Dogwood", "Hickory", "Maple", "Oak", "Red Maple", "Red Oak", "Red Pine", "Sassafras", "Shagbark Hickory", "Sugar Maple", "Unknown", "White Oak", "White Pine"];
        // Checking if the user entered number is within the existing plots
        let binSearchPassed = yield genericBinarySearch(allSpecies, species);
        // Setting a warning if applicable
        const warning = document.getElementById("tree-warning");
        if (!binSearchPassed) {
            warning.style.visibility = "visible";
        }
        else {
            warning.style.visibility = "hidden";
        }
        return binSearchPassed;
    });
}
/**
 * A generic binary search for quick searches of select items within the
 * arrays provided by the API.
 * @param array The array to conduct the binary search on
 * @param lookFor The item we are searching for within the array
 * @returns Whether or not the item could be found
 */
function genericBinarySearch(array, lookFor) {
    return __awaiter(this, void 0, void 0, function* () {
        // stub (on god this looks like a comp 210 assignment right here lol)
        return true;
    });
}
//TODO: create an event listener that makes update buttons work when pulled up and disabled when clicked
// (If this isn't done, you can just spam the enter button to have this happen a ton of times cause async)
//////////// TYPES TO MAKE INFO FROM DB WORK ////////////
//# sourceMappingURL=creation-tools-script.js.map