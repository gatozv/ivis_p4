function importFriends () {
	var data = parseXML("./xslt/friends.xml","./xslt/GoodReadsTrafo2.xslt");
	var friends = eval('(' + data + ')');

	for (var i in friends) {
		var xmlFileURI = "./xslt/compare_"+friends[i].id+".xml";
		var friendData = parseXML(xmlFileURI,"./xslt/FriendDetailsTrafo.xslt");
		
		var friendInfo = eval('(' + friendData + ')');
		
		for (var ii in friendInfo) {
			$.extend(friends[i], friendInfo[ii]);
		}
	}
	console.log(friends);
	return friends;
};