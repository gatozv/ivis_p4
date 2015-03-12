function FetchObject (paType, paQuery, paId) {
    this.query = paQuery;
    this.type  = paType;
    this.id = paId;
    this.timeStart = 0;
    this.timeEnd = 0;
    this.response = "";
}

var fetchQueue = [];
var doneFetches = [];


function GoodReadsDataFetches () {

	var self = this
	
	this.statusUpdate = function(percentage, state){
	}
	
	this.finished = function(data){
	}
	
	this.states  = ["nothing", "loadingMe", "loadingFriends","loadingBookLists","done"] 

	this.start = function(){
	
		var newFO = new FetchObject("me", "php/me.php")

		fetchQueue.push(newFO);
		
		fetchNext();
		
		//console.log("start")
		
		self.statusUpdate(0, "loadingMe")
	}
	
	this.startWithTestingData = function(){
		self.statusUpdate(0, "loadingMe")
		setTimeout(function(){
			self.statusUpdate(0, "loadingFriends")
		}, 100);
		
		setTimeout(function(){
			self.statusUpdate(0, "loadingBookLists")
		}, 3000);
		
		setTimeout(function(){
			self.statusUpdate(10, "loadingBookLists")
		}, 4000);
		
		setTimeout(function(){
			self.statusUpdate(20, "loadingBookLists")
		}, 5000);
		setTimeout(function(){
			self.statusUpdate(30, "loadingBookLists")
		}, 6000);
		setTimeout(function(){
			self.statusUpdate(40, "loadingBookLists")
		}, 7000);
		setTimeout(function(){
			self.statusUpdate(50, "loadingBookLists")
		}, 8000);
		setTimeout(function(){
			self.statusUpdate(60, "loadingBookLists")
		}, 9000);
		setTimeout(function(){
			self.statusUpdate(70, "loadingBookLists")
		}, 10000);
		setTimeout(function(){
			self.statusUpdate(80, "loadingBookLists")
		}, 11000);
		setTimeout(function(){
			self.statusUpdate(90, "loadingBookLists")
		}, 12000);
		setTimeout(function(){
			self.statusUpdate(100, "loadingBookLists")
		}, 13000);
		
		setTimeout(function(){
			self.statusUpdate(100, "done");
			$.ajax('xslt/allDataDiana2.xml', {
			  dataType: 'text',
		      success: function(data) {
		        // console.log("success")
		         self.finished(data)
		      },
		      error: function(data, errorThrown) {
		        // console.log("failure"+errorThrown)
		      }
		   });
			
		}, 13300);
		
	}
}

var goodreadsDataFetches = new GoodReadsDataFetches ();

//document.getElementById("status").innerHTML = "Getting friends list";

function fetchNext(){

	if(fetchQueue.length == 0){
		allFetchesAccomplished()
		return;
	}

	var nextFetchedObject = fetchQueue.shift()
	
	nextFetchedObject.timeStart = new Date();
	
	$.ajax({url: nextFetchedObject.query, 
	        success: function(result){
					fetchDone(nextFetchedObject, result)
				 }
	})
		
}

function fetchDone(paFetchedObject, paResult){
	
	paFetchedObject.timeEnd =  new Date();
	paFetchedObject.response = paResult;
	
	doneFetches.push(paFetchedObject)
	
	//console.log(paFetchedObject)
	
	//console.log("fetch done "+ paFetchedObject.type)
	
	if(paFetchedObject.type == "me"){
	
		var myId = $(paResult).find("user").attr('id')
		var newFO = new FetchObject("myFriends", "php/friends.php?id="+myId, myId)
		fetchQueue.push(newFO);
		var newFO2 = new FetchObject("books","php/books.php?id="+myId, myId);
		fetchQueue.push(newFO2);
		
		goodreadsDataFetches.statusUpdate(0, "loadingFriends")
	}
	
	if(paFetchedObject.type == "myFriends"){
	
		//console.log(paResult)
		var start = $(paResult).find("friends").attr("start")
		var end = 	$(paResult).find("friends").attr("end")
		var total = $(paResult).find("friends").attr("total")
		
		//console.log(start + " "+  end + " "+ total)
		
		if(end < total){
			//console.log("id "+paFetchedObject.id)
			
			var page = end/30 + 1 
			
			//console.log("nextpage "+page)

			var newFO = new FetchObject("myFriends", "php/friends.php?id="+paFetchedObject.id+"&page="+page, paFetchedObject.id)
			fetchQueue.unshift(newFO);
		} else {
			friendListLoaded()	
		}
	
		$(paResult).find("friends").find('user').each(function( index, value ) {
			//console.log($(this).find('id').text());
			var friendId = $(this).find('id').text()
			
			var newFO = new FetchObject("books","php/books.php?id="+friendId, friendId);
			fetchQueue.push(newFO);
		});
	}
	
	if(paFetchedObject.type == "books"){
		//console.log(paResult)
		var start = $(paResult).find("reviews").attr("start")
		var end = 	$(paResult).find("reviews").attr("end")
		var total = $(paResult).find("reviews").attr("total")
		
		//console.log(start + " "+  end + " "+ total)
		
		if(end < total){
			//console.log("id "+paFetchedObject.id)
			
			var page = end/200 + 1 

			var newFO = new FetchObject("books", "php/books.php?id="+paFetchedObject.id+"&page="+page, paFetchedObject.id)
			fetchQueue.unshift(newFO);
			
		} 
		
		nextBookFetchCompleted();
		
	}
	
	//console.log("remaining " + fetchQueue.length)
	
	setTimeout(function(){
		fetchNext()
	}, 1000);
}

function friendListLoaded(){

	//console.log("FRIEND LIST FETCHES DONE");
	
	goodreadsDataFetches.statusUpdate(0, "loadingBookLists")
	
	//document.getElementById("status").innerHTML = "Loading book lists 0%";

}

function nextBookFetchCompleted(){

	var percent = Math.round(doneFetches.length/(fetchQueue.length+doneFetches.length)*100);
		
		
	goodreadsDataFetches.statusUpdate(percent, "loadingBookLists")
	
	//document.getElementById("status").innerHTML = "Loading "+ percent+"%";
}

function allFetchesAccomplished(){
	//console.log("ALL FETCHES DONE");
	
	goodreadsDataFetches.statusUpdate(100, "done")
	
	//document.getElementById("status").innerHTML = "Loading Done";
	
	//console.log(doneFetches)
	
	
	
	doneFetches.forEach(function(d,i,a){
		//remove the first line
		var lines = d.response.split('\n');
		lines.splice(0,1);
		var newtext = lines.join('\n');
		d.response = newtext;
	})
	
	var responsesMe = doneFetches.filter(function(res){
		return res.type == "me"
	})
	
	var responsesFriends = doneFetches.filter(function(res){
		return res.type == "myFriends"
	})
	
	var responsesBooks = doneFetches.filter(function(res){
		return res.type == "books"
	})
	
	
	var responsesUgly = "<AllGoodreadsData>"
	
	responsesUgly += "\n<me>\n";
	
		responsesMe.forEach(function(d,i,a){
			responsesUgly += d.response + "\n"
		})
	
	responsesUgly += "\n</me>\n";
	
	responsesUgly += "\n<myFriends>\n";
	
		responsesFriends.forEach(function(d,i,a){
			responsesUgly += d.response + "\n"
		})
	
	responsesUgly += "\n</myFriends>\n";
	
	responsesUgly += "\n<allBooks>\n";
	
		responsesBooks.forEach(function(d,i,a){
			responsesUgly += "\n<books userId=\""+d.id+"\">\n";
		
			responsesUgly += d.response + "\n"
			
			responsesUgly += "\n</books>\n";
		})
	
	responsesUgly += "\n</allBooks>\n";
	
	
	responsesUgly += "\n </AllGoodreadsData>";
	
	//console.log(responsesUgly)
	
	goodreadsDataFetches.finished(responsesUgly)
	
	//addXMLDownload("allData",responsesUgly);
}

/*
$.ajax({url: "me.php", success: function(result){
        //$("#div1").html(result);
  		//console.log(result);

  		addXMLDownload("me",result);

  		var myId = $(result).find("user").attr('id')

  		setTimeout(function(){
  			getBooks(myId)
  		}, 1000);


  		setTimeout(function(){
  			getFriends(myId)
  		}, 2000);

  		
}});*/

function getFriends(userId) {

    $.ajax({url: "friends.php?id="+userId, success: function(result){
		//console.log(result);

		addXMLDownload("friends",result);

		//console.log("random id "+$(result).find("friends").find('user').first().find('id').text())
		//var id = $(result).find("friends").find('user').first().find('id').text()

		$(result).find("friends").find('user').each(function( index, value ) {
			console.log($(this).find('id').text());
			var id = $(this).find('id').text()
			setTimeout(function (){
				getBooks(id)
			}, 1200*index);
			setTimeout(function (){
				getCompare(id)
			}, 2400*index);
			
		});
	}});
}

function getCompare(userId){
	$.ajax({url: "compare.php?id="+userId, success: function(result){
		//console.log(result);

		addXMLDownload("compare_"+userId,result);
	}});
}

function getBooks(userId){
	$.ajax({url: "books.php?id="+userId, success: function(result){
		//console.log(result);
		addXMLDownload(userId,result);
	}});
}

