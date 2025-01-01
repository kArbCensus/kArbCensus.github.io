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
            // Construct request body
            const payload = {
                email: newEmail,
                password: newPas,
            };
            // Get the API endpoint
            const addAccUrl = (yield globalThis.baseApiUrl) + "add-account";
            // Add content type and authorization token to headers
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${globalThis.authToken}`,
            };
            // Make an API request to create new account
            yield fetch(addAccUrl, {
                headers,
                method: "POST",
                body: JSON.stringify(payload)
            });
            // Clearing out modal's input boxes
            document.getElementById("new-email").value = "";
            document.getElementById("new-pas").value = "KArbPassword123";
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
        // Getting the land cover type
        let coverType = document.getElementById("new-cover-type").value;
        coverType = coverType.trim();
        // For clarity, showing that the focal tree tree-id will be null
        let focalTreeID = null;
        // Ensuring the same plot doesn't already exist
        if (yield configPlotWarning(newPlot, coverType)) {
            // TODO: Post request to the DB with the new plot number
            // Testing
            console.log(newPlot);
            // Clearing out modal's input boxes
            document.getElementById("new-plot").value = "";
            document.getElementById("new-cover-type").value = "";
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
        // Removing random capitalization and whitespace as a factor
        newTree = newTree.toLowerCase().trim();
        /*
        Making the first letter of each word capitalized with regex
            For context and future debugging, the regex statement is comprised of:
            "/ /g" => the inside escape characters are global and as such continuously looked for
            "\b" => looking for a only the starting characters (boundary chars) and...
            "\w" => looking at every word character
        */
        newTree = newTree.replace(/\b\w/g, (firstLetter) => firstLetter.toUpperCase());
        // Ensuring the same plot doesn't already exist
        if (yield configTreeWarning(newTree)) {
            // TODO: Post request to the DB with the new tree species
            // Testing
            console.log(newTree);
            // Clearing out modal's input box
            document.getElementById("new-tree").value = "";
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
        // Getting this modals warning label
        const warning = document.getElementById("account-warning");
        // Ensuring both an email and password were provided
        if (email === "" || password === "") {
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
 * Checks if a plot number is valid and gives a warning if not.
 * @param plot The plot id the user is trying to enter into the database
 * @returns Gives whether or not if its ok to use the specified plot number
 */
function configPlotWarning(plot, coverType) {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting this modals warning label
        const warning = document.getElementById("plot-warning");
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
    });
}
/**
 * Checks if a tree species the user wants to enter is valid and gives them a warning if not.
 * @param species The tree name the user is trying to enter into the database
 * @returns Gives whether or not its ok to use the specified tree species
 */
function configTreeWarning(species) {
    return __awaiter(this, void 0, void 0, function* () {
        // Getting this modals warning label
        const warning = document.getElementById("tree-warning");
        // Ensuring something was entered
        if (species === "") {
            warning.innerHTML = "";
            warning.appendChild(document.createTextNode("Invalid species: provided tree name has no value"));
            warning.style.visibility = "visible";
            return false;
        }
        //TODO: Make this an API call where you get each of the trees species
        // TEMP hard coded trees for testing
        const allSpecies = ["American Elm", "Beech", "Bitternut Hickory", "Black Cherry", "Black Locust", "Black Oak", "Dogwood", "Hickory", "Maple", "Oak", "Red Maple", "Red Oak", "Red Pine", "Sassafras", "Shagbark Hickory", "Sugar Maple", "Unknown", "White Oak", "White Pine"];
        // Checking if the user entered number is within the existing plots
        let binSearchFound = yield genericBinarySearch(allSpecies, species, 0, allSpecies.length - 1);
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
//# sourceMappingURL=creation-tools-script.js.map