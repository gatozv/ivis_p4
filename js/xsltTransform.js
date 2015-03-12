function loadXMLDoc (filename) {
	if (window.ActiveXObject) {
		xhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		xhttp = new XMLHttpRequest();
	}
	xhttp.overrideMimeType('text/xml');
	xhttp.open("GET", filename, false);
	xhttp.send(null);
	xmlDoc = xhttp.responseXML;
	return xmlDoc;
}

function parseXML(xmlFile, xslFile) {
	xml = loadXMLDoc(xmlFile);
	xsl = loadXMLDoc(xslFile);
	// code for IE
	if (window.ActiveXObject || xhttp.responseType == "msxml-document")
	{
		return "IE support not implemented yet... sorry, not sorry.";
	}
	// code for Chrome, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsl);
		resultDocument = xsltProcessor.transformToFragment(xml, document);
		var xmlAsString = new XMLSerializer().serializeToString( resultDocument );
		return xmlAsString;
	}
}

function parseXMLString(xmlString, xslFile) {
	xsl = loadXMLDoc(xslFile);
	//console.log(xsl)
	var parser = new DOMParser()
	var doc = parser.parseFromString(xmlString, "text/xml");
	// code for IE
	if (window.ActiveXObject || xhttp.responseType == "msxml-document")
	{
		return "IE support not implemented yet... sorry, not sorry.";
	}
	// code for Chrome, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsl);
		resultDocument = xsltProcessor.transformToFragment(doc, document);
		//console.log(resultDocument);
		var xmlAsString = new XMLSerializer().serializeToString( resultDocument );
		return xmlAsString;
	}
}