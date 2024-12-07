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
        location.reload();
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
        if (configPlotWarning(newPlot)) {
            // TODO: Post request to the DB with the new plot number
            // User feedback via a reload
            location.reload();
        }
    });
}
/**
 * Grabs a new inserted tree species and sends it to the data base.
 */
function createNewTreeSpecies() {
    // Getting the new tree species
    let newTree = document.getElementById("new-tree").value;
    // Ensuring the same plot doesn't already exist
    if (configTreeWarning(newTree)) {
        // TODO: Post request to the DB with the new tree species
        // User feedback via a reload
        location.reload();
    }
}
//TODO: Config to check/set warning for new plot
function configPlotWarning(plot) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
//TODO: Config to check/set warning for new species
function configTreeWarning(species) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
//TODO: event listener to turn off all modal warnings if a modal is hidden
// Refresh page on submission?
// Since the survey shows your added tree, it has fine user feedback.
// But here I feel a page refresh would assure me I did something
//////////// TYPES TO MAKE INFO FROM DB WORK ////////////
//# sourceMappingURL=creation-tools-script.js.map