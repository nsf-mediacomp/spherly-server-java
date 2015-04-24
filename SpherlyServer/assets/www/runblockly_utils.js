/**************************************UTILS**********************************/
function Utils(){};

Utils.divMove = function(e){
	var div = $("#dialog");
	div.css("position", "absolute");
	div.css("top", (e.clientY-offY) + 'px');
	div.css("left", (e.clientX-offX) + 'px');
}

Utils.closeDialog = function(){
	$("#dialog").css("display", "none");
}

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Utils.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

Utils.rgbToHex = function(r, g, b){
    return "#" + Utils.componentToHex(r) + Utils.componentToHex(g) + Utils.componentToHex(b);
}

Utils.hexToRgb = function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

Utils.hsvToHex = function(h, s, v){
	var c = Utils.HSVtoRGB(h, s, v);
	return Utils.rgbToHex(c.r, c.g, c.b);
}

//http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
Utils.HSVtoRGB = function(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
Utils.createDownloadLink = function(anchorSelector, str, fileName){
	if(window.navigator.msSaveOrOpenBlob) {
		var fileData = [str];
		blobObject = new Blob(fileData);
		$(anchorSelector).click(function(){
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	} else {
		var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
		$(anchorSelector).attr("download", fileName);               
		$(anchorSelector).attr("href", url);
	}
}

//http://stackoverflow.com/questions/6507293/convert-xml-to-string-with-jquery
Utils.xmlToString = function (xmlData) { 
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}   
