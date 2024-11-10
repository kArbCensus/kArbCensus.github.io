function confirmCreateNewCensus() {
    const currentYear = new Date().getFullYear();

    setNewPopUpText("Are you sure you want to start a new census for the year: " + currentYear);
}

function confirmEndCurrentCensus() {
    setNewPopUpText("Are you sure you want to end the current census.");
}

function setNewPopUpText(text: string) {
    const popUp = document.getElementById("pop-up-text");
    popUp.innerHTML = "";
    popUp.appendChild(document.createTextNode(text));
}