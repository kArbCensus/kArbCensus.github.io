// Populating the plot drop down
function createPlotOptions() {

    const select = document.getElementById("plot-select") as HTMLSelectElement;

    //TODO: have this not be a set #, but rather do an API call to get the total number of plots
    for (let i = 1; i < 41; i++)
    {
        const option = document.createElement('option');
        option.value=""+i;
        option.appendChild(document.createTextNode(""+i));
        select?.appendChild(option);
    }
}

// Updating the table for a new plot choice
function updateSurveyTable()
{
    const surveyTable = document.getElementById("survey-table");

    if(surveyTable.style.visibility == "hidden")
    {
        surveyTable.style.visibility = "visible";
    }

    // Getting our plot
    const selection = document.getElementById("plot-select") as HTMLSelectElement;
    const chosenPlot = parseInt(selection.options[selection.selectedIndex].value);

    console.log(chosenPlot);


    //TODO: Do an API call to get all of the trees in the chosen plot
    

}