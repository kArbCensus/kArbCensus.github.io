function confirmCreateNewCensus() {
    setNewPopUpText("Test 1");
}
function confirmEndCurrentCensus() {
    setNewPopUpText("Test 2");
}
function setNewPopUpText(text) {
    const popUp = document.getElementById("pop-up-text");
    popUp.innerHTML = "";
    popUp.appendChild(document.createTextNode(text));
}
//# sourceMappingURL=admin-script.js.map