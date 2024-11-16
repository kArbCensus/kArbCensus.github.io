/*
    For one reason or another, the following scripts were not working with typescript.
    To keep things simple, I have decided to put all of these messed up functions into
    this file, with the goal of eventually adding these into ts files.
*/


/**
 *Finds all tooltip spots in the code and passes them on to be created.
*/
function setupToolTips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(createAToolTip);
}


/**
 * Initializes a tooltip at a provided marked spot.
 */
function createAToolTip(tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
}


/**
 * Gives the user feedback when updating the survey table by closing the modal and refreshing
*/
function closeModal() {
    if (document.getElementById("submission-notice").style.visibility == "hidden") {
        bootstrap.Modal.getOrCreateInstance(document.getElementById("pop-up")).hide();
        updateSurveyTable();
    }
}