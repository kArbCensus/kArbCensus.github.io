// Toggles element visibility by id
function changeVis(id: string) {
    var dropDown = document.getElementById(id);

    if (dropDown.style.visibility == "visible") {
        dropDown.style.visibility = "hidden"
    }

    else {
        dropDown.style.visibility = "visible"
    }
}