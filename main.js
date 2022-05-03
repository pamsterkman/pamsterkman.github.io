const BRTA_ATTRIBUTION = 'Kaartgegevens: © <a href="http://www.cbs.nl">CBS</a>, <a href="http://www.kadaster.nl">Kadaster</a>, <a href="http://openstreetmap.org">OpenStreetMap</a><span class="printhide">-auteurs (<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>).</span>'

// a function for obtaining a layer object, which can be added to the map
function getWMTSLayer (layername, attribution) {
  return L.tileLayer(`https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/${layername}/EPSG:28992/{z}/{x}/{y}.png`, {
    WMTS: false,
    attribution: attribution,
    crossOrigin: true
  })
}

// 1. BRT-backdrop map variants from PDOK:
const brtRegular = getWMTSLayer('standaard', BRTA_ATTRIBUTION)
const brtGrijs = getWMTSLayer('grijs', BRTA_ATTRIBUTION)
const brtPastel = getWMTSLayer('pastel', BRTA_ATTRIBUTION)
const brtWater = getWMTSLayer('water', BRTA_ATTRIBUTION)


// see "Nederlandse richtlijn tiling" https://www.geonovum.nl/uploads/standards/downloads/nederlandse_richtlijn_tiling_-_versie_1.1.pdf
// Resolution (in pixels per meter) for each zoomlevel
var res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420]

// The map object - Javascript object that represents the zoomable map component
// Projection parameters for RD projection (EPSG:28992):
var map = L.map('map-canvas', {
  continuousWorld: true,
  crs: new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', {
    transformation: L.Transformation(-1, -1, 0, 0),
    resolutions: res,
    origin: [-285401.920, 903401.920],
    bounds: L.bounds([-285401.920, 903401.920], [595401.920, 22598.080])
  }),
  layers: [
    brtRegular
  ],
  center: [52.0047529, 4.3702697],
  zoom: 10,
})

// 2. aerial photo * not working at this moment (see Assignment)
//    - can be switched on/off by toggle thru L.control.layers (see below in this script)
var wms_aerial_url = "https://geodata1.nationaalgeoregister.nl/luchtfoto/wms?"; 
var basemap_aerial = new L.tileLayer.wms(wms_aerial_url, {
    layers: ['luchtfoto_png'],
    styles: '',
    format: 'image/png',
    transparent: true,
    pointerCursor: true
});
basemap_aerial.getAttribution = function() {
    return 'Luchtfoto WMS <a href="https://www.kadaster.nl">Kadaster</a>.';
}


// 3. a thematic WMS as overlay map
var wms_sound_url = "https://geodata.nationaalgeoregister.nl/rwsgeluidskaarten/ows?"
var sound = new L.tileLayer.wms(wms_sound_url, {
                        layers: ['Lden_2016'],
                        styles: '',
                        format: 'image/png',
                        transparent: true,
                        attribution: '© <a href="https://www.rws.nl/"> Rijkswaterstaat</a>',
                        pointerCursor: true,
                        }) ;

var overlays = {
    "Road noise [WMS]": sound,
};

//4. Part B Question 1 WMS layer showing parcels 
var wms_parcel_url = "http://localhost:8080/geoserver/delft_parcels/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES&LAYERS=delft_parcels%3Aparcels&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A28992&WIDTH=481&HEIGHT=769&BBOX=80274.01722408373%2C438543.7036555281%2C89455.2803996358%2C453203.1841520437"
var parcel = new L.tileLayer.wms(wms_parcel_url, {
                        layers: ['parcels'],
                        styles: '',
                        format: 'image/png',
                        transparent: true,
                        //attribution: '© <a href="https://www.rws.nl/"> Rijkswaterstaat</a>',
                        pointerCursor: true,
                        }) ;
var overlays2 = {
    "Parcels [WMS]": parcel,
};

var baseLayers = {
  'BRT-Achtergrondkaart [WMTS]': brtRegular,
  'BRT-Achtergrondkaart Grijs [WMTS]': brtGrijs,
  'BRT-Achtergrondkaart Pastel [WMTS]': brtPastel,
  'BRT-Achtergrondkaart Water [WMTS]': brtWater,
  "Aerial photo [WMS]": basemap_aerial,
  "Parcels [WMS]": parcel,
}

var all_overlays = {
	"Road noise": sound, 
	"Parcels": parcel, 
}

L.control.layers(baseLayers, all_overlays).addTo(map)


