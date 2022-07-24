import L from 'leaflet';


const ccdIcon = L.icon({
    iconUrl: require('./icons/coffee-shop.png'),
    iconSize: [35, 40],
    iconAnchor: [17, 46],
    popupAnchor: [0, -40]
});

const starBucksIcon = L.icon({
    iconUrl: require('./icons/pizza.png'),
    iconSize: [35, 40],
    iconAnchor: [17, 46],
    popupAnchor: [0, -40]

});

const locations = [
    {
        name: "CCD_1",
        latLog: {
            lat: 22.366300141906958,
            lng: 73.17568417517695
        },
        icon: ccdIcon
    },
    {
        name: "CCD_2",
        latLog: {
            lat: 22.397643270742158,
            lng: 71.00627411854124
        },
        icon: ccdIcon
    },
    {
        name: "StarBucks_1",
        latLog: {
            lat: 23.008072570408963,
            lng: 72.53251268041615
        },
        icon: starBucksIcon
    },
    {
        name: "StarBucks_2",
        latLog: {
            lat: 23.916774102317714,
            lng: 69.72339529904676
        },
        icon: starBucksIcon
    }
]

export default locations