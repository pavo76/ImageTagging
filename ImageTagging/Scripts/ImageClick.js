// variable for storing pressed coordinates
var coordsString = "";
// variable for naming id of new area element
var areaIDIndex = 0;

// adds coordinates of clicked position in image to the coordsString variable
// adds temporary area if temporary area with id="tempArea" doesn't exist
// else it adds new coordinates to temporary area
function imageOnClick(elementRef) {
    var posObject = getEventLocation(event);
    if (coordsString == "") {
        coordsString = posObject.x + ", " + posObject.y;
    }
    else if (coordsString != "") {
        coordsString = coordsString + ", " + posObject.x + ", " + posObject.y
    }
    if (!CheckIfAreaExists("tempArea")) {
        AddTempArea("map")
    }
    else if (CheckIfAreaExists("tempArea")) {
        EditTempArea();
    }
}

// returns coordinates of position in image where mouse was clicked
function getEventLocation(eventRef) {
    var positionX = 0;
    var positionY = 0;
    var $img = $(eventRef.target);
    var offset = $img.offset();
    if (eventRef.pageX) {
        positionX = eventRef.pageX - offset.left;
        positionY = eventRef.pageY - offset.top;
    }
    else if (window.event) {
        positionX = eventRef.clientX + document.body.scrollLeft;
        positionY = eventRef.clientY + document.body.scrollTop;
    }
    else if (eventRef.clientX) {
        positionX = eventRef.clientX;
        positionY = eventRef.clientY;
    }

    return { x: positionX, y: positionY };
}

// Clears variable coordsString
function ClearCoordsString() {
    coordsString = "";
    RemoveArea("tempArea", "map");
    Hilight();
}

// adds Area child element to map with id="mapID"
// id of Area is set to area + areaIDIndex 
// areaIDIndex autoincrements for each area added
// removes temporary area with id="tempArea" from map
// clears coordsString
function AddArea(mapID) {
    var map = document.getElementById(mapID);

    RemoveArea("tempArea", mapID);
    area = document.createElement("area");
    area.shape = "poly";
    area.coords = coordsString;
    area.href = "#";
    area.title = "da";
    area.alt = "da";
    var areaID = "area" + areaIDIndex;
    area.setAttribute("id", areaID);
    map.appendChild(area);

    areaIDIndex += 1;
    ClearCoordsString();
    Hilight();
}


//  removes area with id="areaID" from map with id="mapID""
function RemoveArea(areaID, mapID) {
    var map = document.getElementById(mapID);
    map.removeChild(document.getElementById(areaID))
}

// checks if an area element with id="areaID" exists
// returns true if it exists, otherwise returns false
function CheckIfAreaExists(areaID) {
    var exists = !!document.getElementById(areaID);
    if (exists) {
        return true;
    }
    else
        return false;
}

// adds temporary area with id="tempArea" on map with id="mapID"
function AddTempArea(mapID) {
    var map = document.getElementById(mapID);

    area = document.createElement("area");
    area.shape = "poly";
    area.coords = coordsString;
    area.href = "#";
    area.title = "da";
    area.alt = "da";
    area.setAttribute("id", "tempArea");
    map.appendChild(area);
    Hilight();
}


// changes coordinates of temporary area to current coordsString
function EditTempArea() {
    var area = document.getElementById("tempArea");
    area.coords = coordsString;
    Hilight();
}


// Hilights te areas of image map using JQuery plugin maphilight
function Hilight() {
    $(function () {
        $('.map').maphilight({
            fillColor: '008800',
            alwaysOn: true
        });
    });
}

