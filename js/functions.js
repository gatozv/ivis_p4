
//initialize variables
var svgWidth = window.outerWidth;
var svgHeight= window.outerHeight-214;
var svgContainer = d3.select("svg") //create container
                     // .append("svg")
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

var initFriends = importFriends();
var friends = [];

//random friends generator
for (var i = 0; i <initFriends.length ; i++) {
  
  var friend = {};
  friend["id"] = initFriends[i].id;
  friend["name"] = initFriends[i].name;
  friend["totalBooks"] = initFriends[i].their_total_books_count;
  friend["commonBooks"] = initFriends[i].common_count;
  friends.push(friend);
};

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

var distanceFromMeMax = 500;
//creates a scale for the number of books
var scale = d3.scale.linear().domain([0,600]).range([3,10]);

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
            .attr("fill", "url(#grad1)");
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
