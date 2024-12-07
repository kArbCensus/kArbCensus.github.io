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
function closeModal(modalID) {
    if (document.getElementById(modalID).style.visibility == "hidden") {
        bootstrap.Modal.getOrCreateInstance(document.getElementById("pop-up")).hide();
    }
}