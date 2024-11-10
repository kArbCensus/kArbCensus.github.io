// The current year
const currentYear = new Date().getFullYear();
function censusStatusYearSetup() {
    // Setting up the current displayed census year
    const censusYearStatus = document.getElementById("census-status-year");
    censusYearStatus.innerText = "Current Census: " + currentYear;
}
function confirmCreateNewCensus() {
    setNewPopUpText("Are you sure you want to start a new census for the year: " + currentYear);
}
function confirmEndCurrentCensus() {
    setNewPopUpText("Are you sure you want to end the current census.");
}
function setNewPopUpText(text) {
    const popUp = document.getElementById("pop-up-text");
    popUp.innerHTML = "";
    popUp.appendChild(document.createTextNode(text));
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