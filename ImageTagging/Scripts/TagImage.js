// Script enables tagging parts of the image with polygons and circles
// Using maphilight jquery plugin, it shows the tagged area

// variable for storing pressed coordinates
var coordsString = "";
// variable for naming id of new area element
var areaIDIndex = 0;
// variable for checking wether tag should be polygon or circle
var tagFormatPoly = true;
// variables for determining center and radius of a circle tag
var circleX = 0;
var circleY = 0;
var circleRadius = 100;

// check if tag format is polygon or circle
// if polygon, adds coordinates of clicked position in image to the coordsString variable
// if circle, it changes the coordinates of the circle and changes coordsString accordingly
// adds temporary area if temporary area with id="tempArea" doesn't exist
// else it adds new coordinates to temporary area
function imageOnClick(eventRef) {
    var posObject = getEventLocation(eventRef);
    if (tagFormatPoly)
    {
        if (coordsString == "") {
            coordsString = posObject.x + ", " + posObject.y;
        }
        else if (coordsString != "") {
            coordsString = coordsString + ", " + posObject.x + ", " + posObject.y
        }
    }
    else if (!tagFormatPoly)
    {
        circleX = posObject.x;
        circleY = posObject.y;
        coordsString = circleX + ", " + circleY + ", " + circleRadius;
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
        if (positionX < 0)
        {
            positionX = 0;
        }
        positionY = eventRef.pageY - offset.top;
        if (positionY < 0) {
            positionY = 0;
        }
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

// Clears variable coordsString and removes temporary area
function ClearCoordsString() {
    coordsString = "";
}

// adds Area child element to map with id="mapID"
// depending on the tag format, area type is circle or poly
// id of Area is set to area + areaIDIndex 
// areaIDIndex autoincrements for each area added
// removes temporary area with id="tempArea" from map
// clears coordsString
function AddArea(mapID) {
    var map = document.getElementById(mapID);    
    area = document.createElement("area");
    if (tagFormatPoly) {
        area.shape = "poly";
    }
    else if (!tagFormatPoly) {
        area.shape = "circle";
    }
    area.coords = coordsString;
    // test values, can be adjusted later
    area.title = "da";
    area.alt = "da";
    var areaID = "area" + areaIDIndex;
    area.setAttribute("id", areaID);
    map.appendChild(area);

    areaIDIndex += 1;
    ClearTempArea();
    Hilight();
}


//  removes area with id="areaID" from map with id="mapID" if it exists
function RemoveArea(areaID, mapID) {
    var map = document.getElementById(mapID);
    if (CheckIfAreaExists(areaID)) {
        map.removeChild(document.getElementById(areaID));
    }
}

// checks if an area element with id="areaID" exists
// returns true if it exists, otherwise returns false
function CheckIfAreaExists(areaID) {
    var exists = !!document.getElementById(areaID);
    if (exists) {
        return true;
    }
    else
    {
        return false;
    }
}

// adds temporary area with id="tempArea" on map with id="mapID"
// depending on the tag format, area type is circle or poly
function AddTempArea(mapID) {
    var map = document.getElementById(mapID);

    area = document.createElement("area");
    if (tagFormatPoly)
    {
        area.shape = "poly";
    }
    else if (!tagFormatPoly)
    {
        area.shape = "circle";
    }
    area.coords = coordsString;
    // test values, can be adjusted later
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

// removes the temporary area
function ClearTempArea()
{
    ClearCoordsString();
    RemoveArea("tempArea", "map");
    Hilight();
}


// Hilights te areas of image map using JQuery plugin maphilight
// Needs to be called after every change on Image map
function Hilight() {
    $(function () {
        $('.map').maphilight({
            fillColor: '555555',
            fillOpacity: 0.35,
            strokeColor: 'bbbbbb',
            strokeWidth: 2,
            alwaysOn: true
        });
    });
}


// Switches between tagging with polygon and tagging with circle
// Clears temporary area on switch
function ChangeTagFormat()
{
    var button = document.getElementById("btnChangeTagFormat");
    tagFormatPoly = !tagFormatPoly;
    ClearTempArea();
    if (tagFormatPoly)
    {
        button.setAttribute("value", "Circle");
    }
    else
    {
        button.setAttribute("value", "Polygon");
    }
    ShowRadiusInput();
}

// Toggles visibility of the input for adjusting radius of circle tag
function ShowRadiusInput()
{
    if (tagFormatPoly) {
        document.getElementById("radiusDiv").style.visibility = "hidden";
    }
    if (!tagFormatPoly) {
        document.getElementById("radiusDiv").style.visibility = "visible";
    }
}

// Changes the area of circle tag to match the adjusted radius
function ChangeRadius()
{
    var radius=document.getElementById("nmbRadius").value;
    circleRadius = radius;
    coordsString = circleX + ", " + circleY + ", " + circleRadius;
    if (CheckIfAreaExists("tempArea")) {
        EditTempArea();
    }
}

// Connects element with id="elementeID" and area with id="areaID"
function ConnectArea(elementID, areaID)
{
    elementID = "#" + elementID;
    areaID="#"+areaID
    $(elementID).mouseover(function (e) {
        $(areaID).mouseover();
    }).mouseout(function (e) {
        $(areaID).mouseout();
    });
}

function AddCoordsToModel()
{
    document.getElementById("areaCoords").value = coordsString;
}

function AddShapeToModel() {
    if (tagFormatPoly) {
        document.getElementById("areaShape").value = "poly";
    }
    else if (!tagFormatPoly) {
        document.getElementById("areaShape").value = "circle";
    }
}