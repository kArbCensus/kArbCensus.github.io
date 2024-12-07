async function checkAdmin() {
    await globalThis.promiseAdmin;
    if (!isAdmin) {
        window.location.href = "/";
    }
}


//TODO: any scripts needed surrounding getting the CSV go here