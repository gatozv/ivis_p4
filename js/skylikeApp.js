function drawStars(friends){
//initialize variables
var svgWidth = window.outerWidth;
var svgHeight= window.outerHeight;
var svgContainer = d3.select("#skylikeApp") //create container
                     .append("svg")
                     .attr("width", svgWidth )
                     .attr("height",svgHeight)
                     .attr("id", "svgContainer");
//console.log(importFriends());
//create the blurry lines
var radialGradient = svgContainer.append("defs").append("radialGradient")
                          .attr("id","grad1")
                          .attr("cx","50%")
                          .attr("cy","50%")
                          .attr("r","50%")
                          .attr("fx","50%")
                          .attr("fy","50%");
radialGradient.append("stop")
              .attr("offset","50%")
              .style("stop-color","#F2F1EF")
radialGradient.append("stop")
              .attr("offset","100%")
              .style("stop-color","#F2F1EF")
              .style("stop-opacity",0)

//gets the maximum of any of the fields in friends
function maxOfFriendsList(friendsList, attr){
  var max = 0;
  for (var i = friendsList.length - 1; i >= 0; i--) {
     max = friendsList[i][attr] > max ? friendsList[i][attr] :  max;
  };
  return max;
}

var friendsTotal = friends.length;
// var maxFriendsCommon = maxOfFriendsList(friends, "friendsInCommon");
var maxCommonBooks = maxOfFriendsList(friends, "commonBooks");

//origins of the graph 
var xOrigin = svgWidth/2;
var yOrigin = svgHeight/2;

var distanceFromMeMax = svgHeight/2-40;
//creates a scale for the number of books
var scale = d3.scale.linear().domain([0, maxOfFriendsList(friends, "totalBooks")]).range([3,12]);

//plots the data
svgContainer.selectAll("circle")
            .data(friends)
            .enter()
            .append("circle")
            .attr("cx",function(d, i){return coordinateX(d["commonBooks"], i)})
            .attr("cy",function(d, i){return coordinateY(d["commonBooks"], i)})
            .attr("r", function(d) {return scale(d["totalBooks"])   })
            .attr("id", function(d){ return d["id"] + d["name"];})
            .attr()
            .style("opacity","0")
            .attr("class", "friend")
            .attr("fill", "url(#grad1)")
            .on("click", function(d, i) {

            //Get this bar's x/y values, then augment for the tooltip
            var xPosition = d3.select(this).attr("x") ;
            console.log(coordinateX(d["commonBooks"], i));
            console.log(coordinateY(d["commonBooks"], i));
            var yPosition = parseFloat(d3.select(this).attr("y")) ;

            //Update the tooltip position and value
            d3.select("#tooltip")
              .style("left", coordinateX(d["commonBooks"], i) + "px")
              .style("top", coordinateY(d["commonBooks"], i) + "px")
              .select("#name")
              .text(d["name"]);
            d3.select("#tooltip")
              .select("#avatar")
              .attr("src", d["image"]);
            d3.select("#tooltip")
              .select("#total")
              .text(d["totalBooks"]);
            d3.select("#tooltip")
              .select("#common")
              .text(d["commonBooks"]);
            d3.select("#tooltip")
              .select("#closeFriend")
              .text(d["name"]);

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);

          });
//show the circles one at a time 
var circles = svgContainer.selectAll("circle");
circles[0] = d3.shuffle(circles[0]);
      circles.transition()
            .delay(function(d,i){
              return i*100;
            })
            .duration(1000)
            .style("opacity","1");

//plots myself (red dot)
svgContainer.append("circle")
            .attr("cx",xOrigin)
            .attr("cy",yOrigin)
            .attr("r", 3)
            .style("fill", "red");

//calculates the x coordinate basd
function coordinateX(nBooks, i){

  var angle = 2*Math.PI * (i/friendsTotal);
  var distance = distanceFromMeMax - (nBooks / maxCommonBooks * distanceFromMeMax)+20;
  return xOrigin + distance * Math.cos(angle);
  //return nFriends * 10
}

function coordinateY(nBooks, i){

  var angle = 2*Math.PI * (i/friendsTotal);
  var distance = distanceFromMeMax - (nBooks / maxCommonBooks * distanceFromMeMax) +20;
  return  yOrigin + distance * Math.sin(angle);

  //return nBooks * 10 
}
}//end draw stars

//tooltips 
d3.select("#tooltip").on("click", function() {
                //Hide the tooltip
                d3.select("#tooltip").classed("hidden", true);  
                      
                });
//draw books



var lastSelected ;
function showBooks(data){

      //If no error, the file loaded correctly. Yay!
      console.log(data);   //Log the data.
      //Include other code to execute after successful file load here

      data.sort(function(a, b){return d3.descending(a.date_added, b.date_added);}); 

      var divContainer = d3.select(".containerInner");
      var myBooks = divContainer.selectAll(".book")
      .data(data);
      console.log("number of books: " + data.length);
      var container_height = 117 * data.length;
      $(".containerInner").css("height", container_height);
      var newBookLink = myBooks.enter()
                                .append("div")
                                .attr("class", "book")
                                .append("a")
                                .attr("href", "#");
      newBookLink.append("img")
                .attr("id", function(d, i){return "b" + i})
                .attr("src", function(d) {
                  return d.image_url;})
                .attr("alt", function(d) {return d.title;})
                .attr("title", function(d) {return d.title;})
                .on("click", function(d, i) {
                 var $this = $(this);
       console.log("current:" + i);
       console.log("last selected:" + lastSelected);

       if (i===lastSelected) {
            // already been clicked once, hide it
            d3.select(this).style("background", "rgba(242, 241, 239, 0)")
            d3.select("#bookTooltip").classed("hidden", true);
          }else {
            d3.select("#b" + lastSelected).style("background", "rgba(242, 241, 239, 0)")
            lastSelected = i;
            //Get this bar's x/y values, then augment for the tooltip  
            // var yPosition = d3.select(this).clientY ;
            // console.log(yPosition);

            //Update the tooltip position and value
            d3.select("#bookTooltip")
              // .style("top", window.outerHeight - yPosition + "px")
              .select("#title")
              .text(d.title);
              d3.select("#bookTooltip")
              .select("#author")
              .text(d.author);
            d3.select("#bookTooltip")
              .select("#noFriends")
              .text(d.friendsWhoAlsoRead.length);
            d3.select("#bookTooltip")
              .select("#rating")
              .text(d.rating);
            d3.select("#bookTooltip")
              .select("#goodReads")
              .text(d.average_rating);
            d3.select(this).style("background", "rgba(242, 241, 239, 0.5)")
            //Show the tooltip
            d3.select("#bookTooltip").classed("hidden", false);
            lastSelected = i;
        }//end else

      });


}//end show books
