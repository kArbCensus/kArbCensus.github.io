// Adding in shared elements to html via JQueries
$(function () {
    $('#banner-insert').load('../_shared/in-page/banner.html');
})
$(function () {
    $('#provide-modal-feedback').load('../_shared/in-page/modal-feedback.html');
})


/**
 * Assigning a modal scrollbar style fix if device has a invasive scroll bar on a webpage.
 */
function applyScrollbarStyleFix() {
    if (window.innerWidth > document.documentElement.clientWidth) {
        console.log("TEST!");
        document.body.className = "has-scrollbar";
    }
}

/**
 * Adding in the admin option to the survey banner based on the users role.
 */
async function addAdmin() {

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
        adminLink.className = "banner-drop-option";
        adminLink.ariaLabel = "Access the admin page";
        adminLink.appendChild(document.createTextNode("Admin"));

        adminOption.appendChild(adminLink);

        row.appendChild(spacing);
        row.appendChild(adminOption);

        dropDown.appendChild(row);
    }
}


/**
 * Gives the user feedback when submitting a modal by doing the modal's functionality then closing it.
 * @param {function} functionToAttempt Executing the modal's submission function
 * @param {string} modalWarningID The ID of the warning sign that the submission failed
 * @param {string} modalID The ID of the modal itself
 */
async function confirmModal(functionToAttempt, modalWarningID, modalID) {

    let modal = document.getElementById(modalID);

    // Putting the modal into a pause state
    modal.inert = true;
    let initialPointer = document.body.style.cursor;
    document.body.style.cursor = "wait";


    await functionToAttempt();

    // What to do if no problems existed in executing the modals submission
    if (document.getElementById(modalWarningID).style.visibility == "hidden") {

        // Close the modal
        bootstrap.Modal.getOrCreateInstance(document.getElementById(modalID)).hide();

        // Give the user confirmation that their submission worked
        // Grabbing where content will go
        const template = document.getElementById("feedback-template");
        const placeHolder = document.getElementById("feedback-placeholder");

        // Set up for a new user feedback pop up
        placeHolder.innerHTML = "";
        const content = template.content.cloneNode(true);

        // Applying the new alert that the modal worked
        placeHolder.appendChild(content);
    }

    // Resuming user interaction
    document.body.style.cursor = initialPointer;
    modal.inert = false;

}