// Adding in shared elements
$(function () {
    $('#banner-insert').load('../_shared/in-page/banner.html');
})
$(function () {
    $('#symbol-insert').load('../_shared/in-page/symbol-credit.html');
})


// Having the admin option appear in the drop down
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
        adminLink.appendChild(document.createTextNode("Admin"));

        adminOption.appendChild(adminLink);

        row.appendChild(spacing);
        row.appendChild(adminOption);

        dropDown.appendChild(row);
    }
}