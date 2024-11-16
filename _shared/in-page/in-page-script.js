// Adding in shared elements to html via JQueries
$(function () {
    $('#banner-insert').load('../_shared/in-page/banner.html');
})
$(function () {
    $('#symbol-insert').load('../_shared/in-page/symbol-credit.html');
})


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
        adminLink.id = "banner-drop-option";
        adminLink.ariaLabel = "Access the admin page";
        adminLink.appendChild(document.createTextNode("Admin"));

        adminOption.appendChild(adminLink);

        row.appendChild(spacing);
        row.appendChild(adminOption);

        dropDown.appendChild(row);
    }
}