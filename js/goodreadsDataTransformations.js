function GoodReadsDataTransformations () {

	var compareBooks = function(booklist1, booklist2){
		var commonBooks = 0	
		booklist1.forEach(function(book1){
				var filtered = booklist2.filter(function(book2){
					return book1.title == book2.title
				})
				if(filtered.length>0){commonBooks++}
		})
		return commonBooks
	}
	
	var dataIsSet = 0
	var dataset = {};
	
	var allFriends = [];
	
	this.setData = function(data){
		dataIsSet = 1
		dataset = data
		allFriends = dataset["friends"];
	}

	this.allFriends = function(){
	
		var communities = communityDetection();
	
		//console.log(communities)
	
		return dataset["friends"].map(function(a,i){
			return {
				"id":a.id,
				"name":a.name,
				"totalBooks":a.books.length,
				"community" : communities[i].community,
				"commonBooks":compareBooks(dataset.books,a.books)
			}
		})
	}
	
	var friendsEdgeData = function(){
		
		var edge_data = [];
		
		var maxCommonBooks = 0;
	
		allFriends.forEach(function(friend1,i,a){
  
		  	for(var j = i + 1; j < a.length; j++){
			  	friend2 = a[j]
			  	var commonBooks = compareBooks(friend1.books,friend2.books)
			  	
			  	maxCommonBooks = maxCommonBooks > commonBooks ? maxCommonBooks : commonBooks;
			  	
			  	if(commonBooks >0){
				  	edge_data.push({"source":i,"target":j,"weight":Math.pow(commonBooks,3)/100})
			  	}
			  	
		  	}
		})
		
		//console.log("maxCommonBooks "+maxCommonBooks)
		/*
		edge_data.forEach(function(d){
			d["weight"] = maxCommonBooks - d["weight"];
			
		})*/
		
		return edge_data;
	}
	
	var communityDetection = function(){
		
		var node_data  = allFriends.map(function(d,i,a){
		  	//console.log(+d.id)
		  	return i 
		})
		var edge_data = friendsEdgeData();
		var community = jLouvain().nodes(node_data).edges(edge_data);  
		var community_assignment_result = community();
		
		var friendsWithCommunities = allFriends.map(function(d,i,a){
		  	return {
		  		"id":d.id,
				"name":d.name,
				"community":community_assignment_result[i]
			}
		})
		
		var original_node_data = d3.entries(node_data);
		var node_ids = Object.keys(community_assignment_result);
		
		var max_community_number = 0;
	    node_ids.forEach(function(d){
	      original_node_data[d].community = community_assignment_result[d];
	      max_community_number = max_community_number < community_assignment_result[d] ? community_assignment_result[d]: max_community_number;
	    });
		var communityCount = {}
		for (var i = 0; i<=max_community_number;i++){
			communityCount[i]=0
		}
		node_ids.forEach(function(d){
	      communityCount[original_node_data[d].community]++ 
	    });
	    
	    var communityMapping = {}
	    var curr = 1
		for (var i = 0; i<=max_community_number;i++){
			if(communityCount[i] == 1){
				communityMapping[i]=0
			} else {
				communityMapping[i]=curr 
				curr++
			}
		}
	    
	    
	    console.log(communityCount)
	    
	    friendsWithCommunities.map(function(d,i,a){
		    d.community = communityMapping[d.community]
	    })
	    
	    //console.log(friendsWithCommunities)
	    
		return friendsWithCommunities;
	}
}

var goodreadsDataTransformations = new GoodReadsDataTransformations ();