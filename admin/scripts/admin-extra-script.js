// Adding in shared elements to html via JQueries
$(function () {
    $('.pop-up-top').load('../admin/modal-components/modal-top.html');
})
$(function () {
    $('.pop-up-warning').load('../admin/modal-components/modal-warning.html');
})


/**
 * Gives the user feedback when doing an admin feature by closing the modal
*/
async function confirmModal(functionToAttempt, modalWarningID, modalID) {
    
    await functionToAttempt();

    console.log(document.getElementById("" + modalWarningID).style.visibility);

    if (document.getElementById("" + modalWarningID).style.visibility == "hidden") {
        bootstrap.Modal.getOrCreateInstance(document.getElementById("" + modalID)).hide();
    }
    
}