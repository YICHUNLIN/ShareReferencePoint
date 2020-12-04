var map;
var markers = {};
var gis = new kmGIS()
function kmGIS() {
}

kmGIS.prototype.getByName = function(name) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis?name=${name}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}


function keyup(e) {
    var name = $('.name').val();
    gis.getByName(name)
        .then(function(data){
            if (!markers.hasOwnProperty(name)) { var marker = L.marker([data.data.wgs84.lat, data.data.wgs84.lng]);
                marker.addTo(map);
                markers[name] = marker;
                marker.bindPopup(`<b>編號:${data.data.name}</b><br>高程:${data.data.ele}<br>wgs84: ${data.data.wgs84.lat},${data.data.wgs84.lng}<br>twd97:${data.data.twd97.x},${data.data.twd97.y}`).openPopup();
            }
           $('.name').val("")
        })
        .catch(function(err){
        })
}

function ra() {
    Object.values(markers).forEach(m => {
        map.removeLayer(m);
    });
}

function setEvent() {
    $(".confirm").on('click', keyup);
    $(".reset").on('click', ra)
}



$('document').ready(function(){
    map = L.map('map').setView([24.446781, 118.376470], 12)
    var google = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    })
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16});
    map.addLayer(osm);
    //map.addLayer(google);
    setEvent()
    $('.resultTable').hide();
})


