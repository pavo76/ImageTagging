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
function imageOnClick(eventRef, mapID) {
    var posObject = getEventLocation(eventRef);
    if (tagFormatPoly)
    {
        if (coordsString == "") {
            coordsString = posObject.x + ", " + posObject.y;
        }
        else if (coordsString != "") {
            coordsString = coordsString + ", " + posObject.x + ", " + posObject.y;   
        }
    }
    else if (!tagFormatPoly)
    {
        circleX = posObject.x;
        circleY = posObject.y;
        coordsString = circleX + ", " + circleY + ", " + circleRadius;
    }
    if (!CheckIfAreaExists("tempArea")) {
        AddTempArea(mapID)
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
    var img = document.getElementById("image");
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
function AddArea(mapID, areaID, areaTitle) {
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
    area.title = areaTitle;
    var areaIDFull = areaID + areaIDIndex;
    area.setAttribute("id", areaIDFull);
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
    area.title = "temp";
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
function ChangeTagFormat(buttonID, radiusDivID)
{
    var button = document.getElementById(buttonID);
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
    ShowRadiusInput(radiusDivID);
}

// Toggles visibility of the input for adjusting radius of circle tag
function ShowRadiusInput(radiusDivID)
{
    if (tagFormatPoly) {
        document.getElementById(radiusDivID).style.visibility = "hidden";
    }
    if (!tagFormatPoly) {
        document.getElementById(radiusDivID).style.visibility = "visible";
    }
}

// Changes the area of circle tag to match the adjusted radius
function ChangeRadius(radiusInputID)
{
    var radius = document.getElementById(radiusInputID).value;
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


// adds values of normalized coordsString to the propery of a model
function AddCoordsToModel(modelProperty, imgID)
{
    document.getElementById(modelProperty).value = NormalizeCoords(coordsString, imgID);
}

// adds appropriate value of areaShape depending of tagFormatPoly field to the propery of a model
function AddShapeToModel(modelProperty) {
    if (tagFormatPoly) {
        document.getElementById(modelProperty).value = "poly";
    }
    else if (!tagFormatPoly) {
        document.getElementById(modelProperty).value = "circle";
    }
}

// changes values of coordsString to match the coords of a natural size of a picture
function NormalizeCoords(coords, imgID)
{
    var img = document.getElementById(imgID);
    var imgX = img.clientWidth;
    var imgY = img.clientHeight;
    var imgXNormal = img.naturalWidth;
    var imgYNormal = img.naturalHeight;
    var coordsNormal = "";
    if (coords != "")
    {
        if (tagFormatPoly)
        {
            var coordsArray = coords.split(", ");
            for (i = 0; i < coordsArray.length; ++i) {
                if (i % 2 == 0 || i==0) {
                    var num = parseFloat(coordsArray[i]);
                    if (i == 0) {
                        coordsNormal = coordsNormal + ((num / imgX) * imgXNormal) + ", ";
                    }
                    else if (i > 0) {
                        coordsNormal = coordsNormal + ", " + ((num / imgX) * imgXNormal) + ", ";
                    }
                }
                else if (i % 2 == 1) {
                    var num = parseFloat(coordsArray[i]);
                    coordsNormal = coordsNormal + ((num / imgY) * imgYNormal);
                }
            }
        }
        if (!tagFormatPoly)
        {
            coordsNormal = "";
            var imgD = Math.sqrt(imgX * imgX + imgY * imgY);
            var imgDNormal = Math.sqrt(imgXNormal * imgXNormal + imgYNormal * imgYNormal);
            var coordsArray = coords.split(", ");
            for (i = 0; i < coordsArray.length; ++i)
            {
                var num = parseFloat(coordsArray[i]);
                if (i == 0)
                {
                    coordsNormal = ((num / imgX) * imgXNormal + ", ");
                }
                if (i == 1) {
                    coordsNormal = coordsNormal+((num / imgY) * imgYNormal + ", ");
                }
                if (i == 2) {
                    coordsNormal = coordsNormal + ((num / imgD) * imgDNormal);
                }
            }
        }
    }
    return coordsNormal;
}

// Takes the nomalized coords of an area and switches them to match 
// the size of a shown picture
function CustomizeCoords(coords, imgID) {
    var img = document.getElementById(imgID);
    var imgX = img.clientWidth;
    var imgY = img.clientHeight;
    var imgXNormal = img.naturalWidth;
    var imgYNormal = img.naturalHeight;
    var coordsCustom = "";
    if (coords != "") {
        if (tagFormatPoly)
        {
            var coordsArray = coords.split(", ");
            for (i = 0; i < coordsArray.length; ++i) {
                if (i % 2 == 0 || i == 0) {
                    var num = parseFloat(coordsArray[i]);
                    if (i == 0) {
                        coordsCustom =  ((num / imgXNormal) * imgX) + ", ";
                    }
                    else if (i > 0) {
                        coordsCustom = coordsCustom + ", " + ((num / imgXNormal) * imgX) + ", ";
                    }
                }
                else if (i % 2 == 1) {
                    var num = parseFloat(coordsArray[i]);
                    coordsCustom = coordsCustom + ((num / imgYNormal) * imgY);
                }
            }
        }
        else if (!tagFormatPoly)
        {
            coordsCustom = "";
            var imgD = Math.sqrt(imgX * imgX + imgY * imgY);
            var imgDNormal = Math.sqrt(imgXNormal * imgXNormal + imgYNormal * imgYNormal);
            var coordsArray = coords.split(", ");
            for (i = 0; i < coordsArray.length; ++i) {
                var num = parseFloat(coordsArray[i]);
                if (i == 0) {
                    coordsCustom = ((num / imgXNormal) * imgX + ", ");
                }
                if (i == 1) {
                    coordsCustom = coordsCustom + ((num / imgYNormal) * imgY + ", ");
                }
                if (i == 2) {
                    coordsCustom = coordsCustom + ((num / imgDNormal) * imgD);
                }
            }
        }
    }
    return coordsCustom;
}


// Adds customized coords to an area with id=areaID over image with id=imgID
// Coords passed in a function should be normalized
function AddCustomCoordsToArea(normalizedCoords, areaID, imgID)
{
    var area = document.getElementById(areaID);
    var coords = CustomizeCoords(normalizedCoords, imgID);
    area.setAttribute("coords", coords);
}
