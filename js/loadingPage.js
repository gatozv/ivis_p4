
goodreadsDataFetches.statusUpdate = function(percentage, state) {
    console.log("percentage " + percentage + " state " + state)
    var newwidht = 1678-(percentage/100*1678);
	d3.select(".path").transition().duration(1000).style("stroke-dashoffset", newwidht)		
	document.getElementById("status").innerHTML = "Creating the big bang. " +percentage +"% of the universe ready"
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
    console.log("allfriends");
    console.log(allFriends);
   
    drawStars(allFriends);
    
    var myBooks = goodreadsDataTransformations.myBooks()
    // myBooks.sort(function(a,b) { 
    //     return b.friendsWhoAlsoRead.length - a.friendsWhoAlsoRead.length
    //  } );
    showBooks(myBooks);
    console.log("myBooksSorted")
    console.log(myBooks)
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
