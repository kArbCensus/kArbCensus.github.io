// The current year
const currentYear = new Date().getFullYear();

// Having the admin option appear in the drop down
async function addAdmin2() {

    // Waiting for it to be known if the user is an admin
    await globalThis.promiseAdmin;

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
}



function censusStatusYearSetup() {
    // Setting up the current displayed census year
    const censusYearStatus = document.getElementById("census-status-year")

    //TODO: Make this take the running census
    censusYearStatus.innerText = "Current Census: " + currentYear;
}

function confirmCreateNewCensus() {
    setNewPopUpText(true, "Are you sure you want to start a new census for the year: " + currentYear);
}

function confirmEndCurrentCensus() {
    setNewPopUpText(false, "Are you sure you want to end the current census.");
}

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