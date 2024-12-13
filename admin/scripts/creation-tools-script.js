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
        // Removing whitespace as a factor
        newEmail = newEmail.trim().toLowerCase();
        newPas = newPas.trim();
        // Ensuring the email and password are correct
        if (yield configAccountWarning(newEmail, newPas)) {
            //TODO: Post request to give Auth0 a new account
            // Testing
            console.log(newEmail + " and " + newPas);
        }
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
        // Removing capitalization and whitespace as a factor
        newTree = newTree.toLowerCase().trim();
        // Ensuring the same plot doesn't already exist
        if (yield configTreeWarning(newTree)) {
            // TODO: Post request to the DB with the new tree species
            // Testing
            console.log(newTree);
        }
    });
}
/**
 * Checks if the provided account credentials are valid giving a warning if not.
 * @param email The potential email for a new user
 * @param password The potential password for a new user
 * @returns Gives whether or not its ok to use the specified account credentials
 */
function configAccountWarning(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensuring both an email and password were provided
        const warning = document.getElementById("account-warning");
        if (email === "" || password === "") {
            warning.style.visibility = "visible";
            return false;
        }
        else {
            warning.style.visibility = "hidden";
            return true;
        }
        //TODO: Should this check for existing accounts and do a search?
    });
}
/**
 * Checks if a plot number is valid and gives a warning if not.
 * @param plot The plot id the user is trying to enter into the database
 * @returns Gives whether or not if its ok to use the specified plot number
 */
function configPlotWarning(plot) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensuring a number was entered
        if (Number.isNaN(plot)) {
            document.getElementById("plot-warning").style.visibility = "visible";
            return false;
        }
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
        let binSearchFound = yield genericBinarySearch(plotIds, plot, 0, plotIds.length - 1);
        // Setting a warning if applicable
        const warning = document.getElementById("plot-warning");
        if (binSearchFound) {
            warning.style.visibility = "visible";
            return false;
        }
        else {
            warning.style.visibility = "hidden";
            return true;
        }
    });
}
/**
 * Checks if a tree species the user wants to enter is valid and gives them a warning if not.
 * @param species The tree name the user is trying to enter into the database
 * @returns Gives whether or not its ok to use the specified tree species
 */
function configTreeWarning(species) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensuring something was entered
        if (species === "") {
            document.getElementById("tree-warning").style.visibility = "visible";
            return false;
        }
        //TODO: Make this an API call where you get each of the trees species
        // Make the API call convert trees to all upper case or all lower case
        // TEMP hard coded trees for testing
        const allSpecies = ["american elm", "beech", "bitternut hickory", "black cherry", "black locust", "black oak", "dogwood", "hickory", "maple", "oak", "red maple", "red oak", "red pine", "sassafras", "shagbark hickory", "sugar maple", "unknown", "white oak", "white pine"];
        // Checking if the user entered number is within the existing plots
        let binSearchFound = yield genericBinarySearch(allSpecies, species, 0, allSpecies.length - 1);
        // Setting a warning if applicable
        const warning = document.getElementById("tree-warning");
        if (binSearchFound) {
            warning.style.visibility = "visible";
            return false;
        }
        else {
            warning.style.visibility = "hidden";
            return true;
        }
    });
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
function genericBinarySearch(array, lookFor, start, end) {
    return __awaiter(this, void 0, void 0, function* () {
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
                return yield genericBinarySearch(array, lookFor, start, middle - 1);
            }
            else {
                return yield genericBinarySearch(array, lookFor, middle + 1, end);
            }
        }
    });
}
//TODO: create an event listener that makes update buttons work when pulled up and disabled when clicked
// (If this isn't done, you can just spam the enter button to have this happen a ton of times cause async)
//////////// TYPES TO MAKE INFO FROM DB WORK ////////////
//# sourceMappingURL=creation-tools-script.js.map