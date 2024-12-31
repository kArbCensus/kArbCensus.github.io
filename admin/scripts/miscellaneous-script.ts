async function checkAdmin() {
    await globalThis.promiseAdmin;
    if (!isAdmin) {
        window.location.href = "/";
    }
}

async function downloadCsv() {
    // Wait for auth token to be ready
    await globalThis.authTokenReady;

    // Use authorization in header for API call
    const headers = { "Authorization": `Bearer ${globalThis.authToken}` };

    // Construct URL to get CSV data
    const csvUrl = await globalThis.baseApiUrl + "data-csv";

    try {
        // Fetch CSV file from API
        const response = await fetch(csvUrl, { headers });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blob = await response.blob();

        // Use headers to obtain filename
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "censusData.csv"; // Default filename

        // Extract filename using regex
        if (contentDisposition && contentDisposition.includes('attachment')) {
            const matches = /filename="([^"]*)"/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const elem = document.createElement('a');
        elem.style.display = 'none';
        elem.href = url;
        elem.download = filename; // Set the download attribute with the filename

        // Append the anchor element, click to trigger download, then remove it
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);

        // Revoke the object URL to free up memory
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to fetch CSV file:', error);
    }
};
