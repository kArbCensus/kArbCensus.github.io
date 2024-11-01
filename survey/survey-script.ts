// Populating the plot drop down
function createPlotOptions() {

    const select = document.getElementById("plot-select");

    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (let i = 1; i < 41; i++)
    {
        const option = document.createElement('option');
        option.value=""+i;
        option.appendChild(document.createTextNode(""+i));
        select?.appendChild(option);
    }
}