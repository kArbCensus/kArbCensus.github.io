var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// The current year
const currentYear = new Date().getFullYear();
// Having the admin option appear in the drop down
function addAdmin2() {
    return __awaiter(this, void 0, void 0, function* () {
        // Waiting for it to be known if the user is an admin
        yield globalThis.promiseAdmin;
        // Adding admin option if applicable
        if (globalThis.isAdmin) {
            const dropDown = document.getElementById("banner");
            const row = document.createElement("d");
            row.className = "row";
            const spacing = document.createElement("d");
            spacing.className = "col bg-light";
            const adminOption = document.createElement("d");
            adminOption.className = "col-auto bg-light";
            const adminLink = document.createElement("a");
            adminLink.href = "../admin/";
            adminLink.id = "banner-drop-option";
            adminLink.appendChild(document.createTextNode("Admin"));
            adminOption.appendChild(adminLink);
            row.appendChild(spacing);
            row.appendChild(adminOption);
            dropDown.appendChild(row);
        }
    });
}
function censusStatusYearSetup() {
    // Setting up the current displayed census year
    const censusYearStatus = document.getElementById("census-status-year");
    //TODO: Make this take the running census
    censusYearStatus.innerText = "Current Census: " + currentYear;
}
function confirmCreateNewCensus() {
    setNewPopUpText(true, "Are you sure you want to start a new census for the year: " + currentYear);
}
function confirmEndCurrentCensus() {
    setNewPopUpText(false, "Are you sure you want to end the current census.");
}
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
function startCensus() {
    //TODO: Implement an API call to start a census
    // Refreshing for updated status text
    location.reload();
}
function endCensus() {
    //TODO: Implement an API call to end a census
    // Refreshing for updated status text
    location.reload();
}
//# sourceMappingURL=admin-script.js.map