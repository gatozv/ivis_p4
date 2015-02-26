
//initialize variables
var svgWidth = 1000;
var svgHeight= 1000;
var svgContainer = d3.select("body") //create container
                     .append("svg")
                     .attr("width", svgWidth )
                     .attr("height",svgHeight)

var friends = [];

//random friends generator

for (var i = 0; i <556 ; i++) {
  
  var friend = {}

  friend["id"] = i

  friend["friendsInCommon"] = Math.round(Math.random() * 100) ;
  friend["commonLikes"] = Math.round(Math.random() * 100);

  friends.push(friend);
};

//gets the maximum of any of the fields in friends
function maxOfFriendsList(friendsList, attr){

  var max = 0

  for (var i = friendsList.length - 1; i >= 0; i--) {
     max = friendsList[i][attr] > max ? friendsList[i][attr] :  max
  };

  return max
}

var friendsTotal = friends.length
var maxFriendsCommon = maxOfFriendsList(friends, "friendsInCommon")
var maxLikesCommon = maxOfFriendsList(friends, "commonLikes")

//origins of the graph 
var xOrigin = 500
var yOrigin = 500

var distanceFromMeMax = 300
//plots the data
svgContainer.selectAll("circle")
            .data(friends)
            .enter()
            .append("circle")
            .attr("cx",function(d, i){return coordinateX(d["friendsInCommon"],d["commonLikes"], i)})
            .attr("cy",function(d, i){return coordinateY(d["friendsInCommon"],d["commonLikes"], i)})
            .attr("r", 3)
            .style("fill", "blue")
//plots myself (red dot)
svgContainer.append("circle")
            .attr("cx",xOrigin)
            .attr("cy",yOrigin)
            .attr("r", 3)
            .style("fill", "red")
//calculates the x coordinate basd
function coordinateX(nFriends, nLikes, i){

  var angle = 2 * Math.PI * (i/friendsTotal)
  var distance = distanceFromMeMax - (nLikes / maxLikesCommon * distanceFromMeMax)

 // console.log(distance)
 // console.log(angle)

  var rv = xOrigin + distance * Math.cos(angle);

  //console.log(rv)

  return  rv

  //return nFriends * 10
}

function coordinateY(nFriends, nLikes, i){

  var angle = 2*Math.PI * (i/friendsTotal)
  var distance = distanceFromMeMax - (nLikes / maxLikesCommon * distanceFromMeMax)

  return  yOrigin + distance * Math.sin(angle);

  //return nLikes * 10 
}

console.log("max Friends in Common "+ maxFriendsCommon)
console.log("max Likes in Common "+ maxLikesCommon)
