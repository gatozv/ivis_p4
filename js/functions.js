
//initialize variables
var svgWidth = 1000;
var svgHeight= 800;
var svgContainer = d3.select("svg") //create container
                     // .append("svg")
                     .attr("width", svgWidth )
                     .attr("height",svgHeight)
                     .attr("id", "svgContainer");

var friends = [];

//random friends generator

for (var i = 0; i <85 ; i++) {
  
  var friend = {};

  friend["id"] = i;

  friend["friendsInCommon"] = Math.round(Math.random() * 100) ;
  friend["commonBooks"] = Math.round(Math.random() * 100);

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
var maxLikesCommon = maxOfFriendsList(friends, "commonBooks");

//origins of the graph 
var xOrigin = 500;
var yOrigin = 400;

var distanceFromMeMax = 500;
//plots the data
svgContainer.selectAll("circle")
            .data(friends)
            .enter()
            .append("circle")
            .attr("cx",function(d, i){return coordinateX(d["commonBooks"], i)})
            .attr("cy",function(d, i){return coordinateY(d["commonBooks"], i)})
            .attr("r", 3)
            .attr("class", "friend");

//plots myself (red dot)
svgContainer.append("circle")
            .attr("cx",xOrigin)
            .attr("cy",yOrigin)
            .attr("r", 3)
            .style("fill", "red");
//calculates the x coordinate basd
function coordinateX(nLikes, i){

  var angle = 2 * Math.PI * (i/friendsTotal);
  var distance = distanceFromMeMax - (nLikes / maxLikesCommon * distanceFromMeMax);
  return xOrigin + distance * Math.cos(angle);
  //return nFriends * 10
}

function coordinateY(nLikes, i){

  var angle = 2*Math.PI * (i/friendsTotal);
  var distance = distanceFromMeMax - (nLikes / maxLikesCommon * distanceFromMeMax);
  return  yOrigin + distance * Math.sin(angle);

  //return nLikes * 10 
}

console.log("max Friends in Common "+ maxFriendsCommon);
console.log("max Likes in Common "+ maxLikesCommon);
