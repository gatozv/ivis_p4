var svgWidth = 600;
var svgHeight = 50;
var svgContainer = d3.select("#loadingScreen") //create container
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);
svgContainer.append("rect")
            .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")
            .attr("x", -svgWidth / 2)
            .attr("y", -svgHeight / 2)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("fill", "white")
            .style("stroke-width", 0.5)
            .style("stroke", "#555555");
var progress = svgContainer.append("rect")
                            .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")
                            .attr("x", -svgWidth / 2)
                            .attr("y", -svgHeight / 2)
                            .attr("width", 0)
                            .attr("height", svgHeight)
                            .style("fill", "blue");
//.style("stroke-width",0.5)
//.style("stroke","#555555")
goodreadsDataFetches.statusUpdate = function(percentage, state) {
    console.log("percentage " + percentage + " state " + state)
    var newwidht = (percentage / 100 * svgWidth);
    progress.attr("width", newwidht);
    document.getElementById("status").innerHTML = "state: " + state + " percentage: " + percentage + "%"
    if(state=="done"){
        console.log("i'm here");

        $('#loadingScreen').addClass('hidden');
        $('#skylikeApp').removeClass('hidden');
        $('body').removeClass('sunset');
    }
}
goodreadsDataFetches.finished = function(data) {
    console.log("done")
    var jsonString = parseXMLString(data, "./xslt/AllDataTrafo.xslt")
    var jsonData = jQuery.parseJSON(jsonString);
    console.log(jsonData)
    document.getElementById("status").innerHTML = "done"
    goodreadsDataTransformations.setData(jsonData)
    var allFriends = goodreadsDataTransformations.allFriends()
    console.log("allfriends")
    console.log(allFriends)
    /*
                allFriends.forEach(function(d,i){
                    console.log("id "+ i +" commonwithme " + d.commonBooks + " community "+d.community+ " totalbooks "+d.totalBooks )
                
                })*/
}
var isUsingTestingDataset = getParameterByName("testingData") == "1"
if (isUsingTestingDataset) {
    console.log("startWithTestingData")
    goodreadsDataFetches.startWithTestingData()
} else {
    console.log("start realData!")
    goodreadsDataFetches.start()
}
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
