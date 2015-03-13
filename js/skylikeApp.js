
function drawStars(friends){
  //initialize variables
  var svgWidth = window.innerWidth;
  var svgHeight= window.innerHeight;
  var svgContainer = d3.select("#svgContainer")
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
                
  //plots myself (red dot)
  svgContainer.append("circle")
              .attr("cx",xOrigin)
              .attr("cy",yOrigin)
              .attr("r", 3)
              .style("fill", "red");

  //gets the maximum of any of the fields in friends
  function maxOfFriendsList(friendsList, attr){
    var max = 0;
    for (var i = friendsList.length - 1; i >= 0; i--) {
       max = friendsList[i][attr] > max ? friendsList[i][attr] :  max;
    };
    return max;
  }

  var friendsTotal = friends.length;
  // var maxFriendsCommon = maxOfFriendsList(friends, "friendsInCommon");
  var maxCommonBooks = maxOfFriendsList(friends, "commonBooks");

  //origins of the graph 
  var xOrigin = svgWidth/2;
  var yOrigin = svgHeight/2;

  var distanceFromMeMax = svgHeight/2*0.95;
  //creates a scale for the number of books
  var scale = d3.scale.linear().domain([0, maxOfFriendsList(friends, "totalBooks")]).range([2,10]);
  
  //calculates the x coordinate basd
  function coordinateX(nBooks, i){
  
    var angle = 2*Math.PI * (i/friendsTotal);
    var distance = distanceFromMeMax - (nBooks / maxCommonBooks * distanceFromMeMax)+20;
    return xOrigin + distance * Math.cos(angle);
    //return nFriends * 10
  }

  function coordinateY(nBooks, i){
  
    var angle = 2*Math.PI * (i/friendsTotal);
    var distance = distanceFromMeMax - (nBooks / maxCommonBooks * distanceFromMeMax) +20;
    return  yOrigin + distance * Math.sin(angle);
  
    //return nBooks * 10 
  }
  
  var friendsNestedOnCommunityInter = d3.nest()
                  .key(function(d) { return d.community; })
                  .entries(friends);
  var friendsNestedOnCommunity = {};
  friendsNestedOnCommunityInter.forEach(function(d){
    friendsNestedOnCommunity[+d.key] = d.values
  })
  friendsNestedOnCommunityInter = null  
              
  //console.log("nested friends")           
  //console.log(friendsNestedOnCommunity)
  
  var communities =  Object.keys(friendsNestedOnCommunity);
  
  var loners = friendsNestedOnCommunity[0];
  
  var nonLoners = [];
  
  communities.forEach(function(d){
    if(d!=0){nonLoners = nonLoners.concat(friendsNestedOnCommunity[d])}
  })
  
  console.log("loners "+ loners.length+" nonloners "+nonLoners.length + " totoal "+friendsTotal )
  
  function starCoordinates(friend){
    coordinates = {
      "x":0,
      "y":0
    }
    
    var angle = 0
    
    if(friend.community == 0){
      angle = 2*Math.PI * (loners.indexOf(friend)/loners.length); 
    } else {
      angle = 2*Math.PI * (nonLoners.indexOf(friend)/nonLoners.length);
    }
    
    var distance = 0
    
    var sizeInner = distanceFromMeMax * 0.8;
    
    var sizeOuter = sizeInner *0.6;
    
    var initialSize = distanceFromMeMax * 0.1
    
    if(friend.community == 0){
    
      var characterCharCode = friend.name.toLowerCase().charCodeAt(0) - 97
      var distanceMultiplier = 0.5 + 0.5 * Math.abs(Math.cos(angle))
      distance = sizeInner*0.95 + initialSize +
             distanceMultiplier*(sizeOuter - (characterCharCode/25 * sizeOuter)) ;
    }else{
      distance = sizeInner - (friend.commonBooks / maxCommonBooks * sizeInner) + initialSize;
    }
    
    coordinates.x = xOrigin + distance * Math.cos(angle);
    coordinates.y = yOrigin + distance * Math.sin(angle) * 0.8;
    
    return coordinates;
  }
  
    
  //plots the data
  svgContainer.selectAll("circle")
              .data(friends)
              .enter()
              .append("circle")
              .attr("cx",function(d, i){return starCoordinates(d).x})
              .attr("cy",function(d, i){return starCoordinates(d).y})
              .attr("r", function(d) {return scale(d["totalBooks"])   })
              .attr("id", function(d){ return "friend"+d["id"];})
              .attr()
              .style("opacity","0")
              .attr("class", "friend")
              .attr("fill", "url(#grad1)")
              .attr("stroke-width", "20")
              .attr("stroke", "rgba(0,0,0,0)")
              .on("click", function(d, i) {
                //Get this bar's x/y values, then augment for the tooltip
                var xPosition = starCoordinates(d).x ;
                var yPosition = starCoordinates(d).y ;
              
                if(yPosition>svgHeight-150)
                  {yPosition= yPosition-150 }
                //Update the tooltip position and value
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px")
                  .select("#name")
                  .text(d["name"]);
                d3.select("#tooltip")
                  .select("#avatar")
                  .attr("src", d["image_url"]);
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

  
}//end draw stars

//tooltips 
d3.select("#tooltip").on("click", function() {
                //Hide the tooltip
                d3.select("#tooltip").classed("hidden", true);  
                      
                });
//draw books
var lastSelected=-1 ;
function showBooks(data){
      //If no error, the file loaded correctly. Yay!
      console.log(data);   //Log the data.
      //Include other code to execute after successful file load here
      // data.sort(function(a, b){return d3.descending(a.date_added, b.date_added);}); 
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
             //console.log("current:" + i);
             //console.log("last selected:" + lastSelected);

             if (i===lastSelected) {
                  // already been clicked once, hide it
                  d3.select(this).style("background", "rgba(242, 241, 239, 0)")
                  d3.select("#bookTooltip").classed("hidden", true);
                  d3.select(".constellation").remove();
                  lastSelected = -1;
          }else {
                  d3.select("#b" + lastSelected).style("background", "rgba(242, 241, 239, 0)")
                  lastSelected = i;
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
                  showConstelation(d)
              }//end else
            
          
        
          });

     function showConstelation(book){
     
         d3.select(".constellation").remove()
      
      console.log("book to show ")
       console.log(book)
       console.log(book.friendsWhoAlsoRead)
       
       var friendStars = []
       book.friendsWhoAlsoRead.forEach(function(d){
          
          var idString = "#friend"+d.id
          var friendStar = d3.select(idString)
          
          friendStars.push({
            xValue: friendStar.attr("cx"), 
            yValue: friendStar.attr("cy"), 
            rValue: friendStar.attr("r"), 
            connected: false
          })
       })
       
       console.log(friendStars)
       if (friendStars.length ===1){
       //do something
          d3.selectAll(".ring").remove();
          d3.select("#svgContainer").append("circle")
              .attr("cx", friendStars[0].xValue)
              .attr("cy", friendStars[0].yValue)
              .attr("r", 0)
              
              .attr("class", "ring");
          var grow = d3.selectAll(".ring")
            .transition()
            .duration(3000)
            .attr("r", parseFloat(friendStars[0].rValue)+15)
            .style("opacity","0");
          var shrink = d3.selectAll(".ring")
            .transition()
            .duration(3000)
            .attr("r", 0)
            .style("opacity","1");
       }else{
          d3.select(".ring").remove();
             drawConstellation(friendStars, d3.select("#svgContainer"))
       }
     }
    

}//end show books
