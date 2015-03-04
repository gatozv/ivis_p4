function importFriends2 () {
	var data = parseXML("./xslt/friends.xml","./xslt/GoodReadsTrafo.xslt");
	var friends = eval('(' + data + ')');
	//console.log(friends);
	for (var i in friends) {
		//var xmlFileURI = "./xslt/compare_"+friends[i].id+".xml";
		//var friendData = parseXML(xmlFileURI,"./xslt/FriendCompareBooksTrafo.xslt");
		
		var xmlFileURI = "./xslt/"+friends[i].id+".xml";
		var friendData = parseXML(xmlFileURI,"./xslt/FriendBooksTrafo.xslt");
		
		//console.log(friendData);
		var friendInfo = eval('(' + friendData + ')');
		
		friends[i]["books"] = friendInfo
	/*	for (var ii in friendInfo) {
			$.extend(friends[i], friendInfo[ii]);
		}*/
	}
	console.log(friends);
	return friends;
};