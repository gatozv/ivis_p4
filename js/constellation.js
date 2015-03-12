/*======================================================
				Function to draw constellations
======================================================
This function draws a constellation from the provided array of stars. 
stars - array of stars inside the constellations. They should have the following structure:
	stars = [
		{xValue: number, yValue: number, connected: False},
		{xValue: number, yValue: number, connected: False},
		...
	]	
All objects should have the "connected" set to FALSE!*/			

function drawConstellation(stars, svg){
	//stars[0].connected=true;
	var thisStar = 0;
	var firstPass = true;
	var endPath = false;
	var connections = [];
	var loops = 0;
	var paths = [];
	var currentPath = [];
	//IT WORKS
	//********* first pass: drawing the main connections
	
	console.log("DRAW CONSTELLATION")

	stars.forEach(function(entries, index){
		if(!entries.connected){
			endPath = false;
			thisStar = index;
			do{ // START A PATH
				var closestStar = findClosestStar(thisStar,stars);
				if(closestStar<99){
					var series = {
						"x1": stars[thisStar].xValue,
						"y1": stars[thisStar].yValue,
						"x2": stars[closestStar].xValue,
						"y2": stars[closestStar].yValue
					}
					var intersection = findIntersection(series, connections);
					if(!intersection){
						d3.select(".container").select("svg")
						.append("line")
						.attr("x1", series.x1)
					    .attr("y1", series.y1)
					    .attr("x2", series.x2)
					    .attr("y2", series.y2)
					    .attr("stroke","white");
					    stars[thisStar].connected=true;
					    connections.push(series);
					    currentPath.push(thisStar);
					    thisStar = closestStar;
					}else{
						endPath = true;
						stars[thisStar].connected=true;
						currentPath.push(thisStar);
						paths.push(currentPath);
						currentPath = [];
					}
				}else{
					endPath=true;
					stars[thisStar].connected=true;
					currentPath.push(thisStar);
					paths.push(currentPath);
					currentPath = [];
				}
			}while(!endPath);
		}
	})

	stars[thisStar].connected=true;
	//************* end of first pass

	//*************second pass
	if(paths.length>1){
		paths.sort(function(a,b){return d3.descending(a.length, b.length);});
		do{
			var distBetPaths = findDistances(paths[1],paths[0]);
			distBetPaths.sort(function(a,b){return d3.ascending(a.distance, b.distance);});
			for(var i=0; i<distBetPaths.length; i++){
				var currentIndexS1 = distBetPaths[i].s1;
				var currentIndexS2 = distBetPaths[i].s2;

				var series2 = {
					"x1": stars[currentIndexS1].xValue,
					"y1": stars[currentIndexS1].yValue,
					"x2": stars[currentIndexS2].xValue,
					"y2": stars[currentIndexS2].yValue
				}
				var intersection2 = findIntersection(series2, connections);
				if(!intersection2){
					d3.select(".container").select("svg")
					.append("line")
					.attr("x1", series2.x1)
				    .attr("y1", series2.y1)
				    .attr("x2", series2.x2)
				    .attr("y2", series2.y2)
				    .attr("stroke","white");
				    
				    connections.push(series2);
				    paths[0]=paths[0].concat(paths[1]);
				    paths.splice(1,1)
				    break;
				}else{
					if(i==distBetPaths.length-1){
						console.log("OMG!")
						var currentIndexS1 = distBetPaths[0].s1;
						var currentIndexS2 = distBetPaths[0].s2;

						var series2 = {
							"x1": stars[currentIndexS1].xValue,
							"y1": stars[currentIndexS1].yValue,
							"x2": stars[currentIndexS2].xValue,
							"y2": stars[currentIndexS2].yValue
						}
						d3.select(".container").select("svg")
						.append("line")
						.attr("x1", series2.x1)
					    .attr("y1", series2.y1)
					    .attr("x2", series2.x2)
					    .attr("y2", series2.y2)
					    .attr("stroke","white");
					    connections.push(series2);
					    paths[0]=paths[0].concat(paths[1]);
					    paths.splice(1,1)
					}
				}
			}
		}while(paths.length>1);
	}

	//************* end of second pass

	var lineFunction = d3.svg.line()
                    .x(function(d) { return d.xValue; })
                    .y(function(d) { return d.yValue; })
			        .interpolate("linear");

	function findDistances (minorArray, majorArray){
		var distances = [];
		for(var i=0; i<minorArray.length; i++){
			var point1 = stars[minorArray[i]];
			for(var j=0; j<majorArray.length; j++){
				var point2 = stars[majorArray[j]];
				var newDistance = {
					"s1" : minorArray[i],
					"s2" : majorArray[j],
					"distance" : lineLength(point1, point2)
				}
				distances.push(newDistance);
			}
		}
		return distances;
	}

	function findIntersection (currentLine, lineArray){
		var theyIntersect = false;
		for(var k=0; k<lineArray.length; k++){
			var findIntersect = lineIntersect(lineArray[k].x1, lineArray[k].y1, lineArray[k].x2, lineArray[k].y2, currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2)
			if(findIntersect){
				theyIntersect = true;
				break;
			}
		};
		return theyIntersect;
	}

	function findClosestStar (indexOfActual, arrayOfStars){
		var shortest_distance = Number.MAX_VALUE;
		var indexOfStar = 99;

		for(var j=0; j<arrayOfStars.length; j++){
			if(indexOfActual!=j && !arrayOfStars[j].connected){
				var distance_actual = lineLength(arrayOfStars[indexOfActual], arrayOfStars[j]);
				if(distance_actual<shortest_distance){
					indexOfStar = j;
					shortest_distance = distance_actual;
				}
			}
		}
		return indexOfStar;
	}

	function lineLength(point1, point2){
	    var deltaX = point1.xValue-point2.xValue;
	    var deltaY = point1.yValue-point2.yValue;
	    return Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
	};

	function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
		y1=300-y1;
		y2=300-y2;
		y3=300-y3;
		y4=300-y4;
		x1=x1-5;
		x2=x2-5;
		x3=x3-5;
		x4=x4-5;
		y1=y1-5;
		y2=y2-5;
		y3=y3-5;
		y4=y4-5;
	    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
	    if (isNaN(x)||isNaN(y)) {
	        return false;
	    } else {
	        if (x1>=x2) {
	            if (!(x2<=x&&x<=x1)) {return false;}
	        } else {
	            if (!(x1<=x&&x<=x2)) {return false;}
	        }
	        if (y1>=y2) {
	            if (!(y2<=y&&y<=y1)) {return false;}
	        } else {
	            if (!(y1<=y&&y<=y2)) {return false;}
	        }
	        if (x3>=x4) {
	            if (!(x4<=x&&x<=x3)) {return false;}
	        } else {
	            if (!(x3<=x&&x<=x4)) {return false;}
	        }
	        if (y3>=y4) {
	            if (!(y4<=y&&y<=y3)) {return false;}
	        } else {
	            if (!(y3<=y&&y<=y4)) {return false;}
	        }
	    }
	    return true;
	}

}