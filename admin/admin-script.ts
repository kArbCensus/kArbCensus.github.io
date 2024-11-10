function confirmCreateNewCensus() {
    setNewPopUpText("Test 1");
}

function confirmEndCurrentCensus() {
    setNewPopUpText("Test 2");
}

function setNewPopUpText(text: string) {
    const popUp = document.getElementById("pop-up-text");
    popUp.innerHTML = "";
    popUp.appendChild(document.createTextNode(text));
}