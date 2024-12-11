// Adding in shared elements to html via JQueries
$(function () {
    $('.pop-up-top').load('../admin/modal-components/modal-top.html');
})
$(function () {
    $('.pop-up-warning').load('../admin/modal-components/modal-warning.html');
})


/**
 * Gives the user feedback when submitting a modal by doing the modal's functionality then closing it.
 * @param {function} functionToAttempt Executing the modal's submission function
 * @param {string} modalWarningID The ID of the warning sign that the submission failed
 * @param {string} modalID The ID of the modal itself
 */
async function confirmModal(functionToAttempt, modalWarningID, modalID) {

    let modal = document.getElementById(modalID);

    document.body.style.cursor = "wait";
    modal.inert = true;

    await functionToAttempt();

    // Hiding the modal if applicable
    if (document.getElementById(modalWarningID).style.visibility == "hidden") {
        bootstrap.Modal.getOrCreateInstance(document.getElementById(modalID)).hide();
    }

    document.body.style.cursor = "pointer";
    modal.inert = false;

}

/*
Todos:
Make this ^ method in shared 
Make all of the visibile shifts on a selecting a plot in a div to simplify
Make a refresh
Make modal confirm popup for admin only
*/