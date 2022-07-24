
import React, { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet';
import axios from 'axios';
import locations from './Locations';
import { getDistance } from './utils';

const baseURL = "api.tomtom.com"
const API_KEY = "WR7D4I4Dxi4gPkueBOONH5QAlSDTfW3U"
const ADMIN_KEY = "ygeVWfOjglVqJLxXjHdAGggwi10AgfF2Z1vRLDDSk6GmG5Xj"
const PROJECT_ID = "816ae714-ad3f-4317-89af-81462107666c"
let fromCords;
let polyLine;

function App() {
    const initCenter = {
        lat: 23.008072570408963,
        lng: 72.52408749042945,
    };

    const initZoom = 15;
    const [zoom, setZoom] = useState(initZoom);
    const [nearestCoffeeShop, setNearestCoffeeShop] = useState({});
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [cords, setCords] = useState([]);
    const [map, setMap] = useState({});
    const mapRef = useRef(null);


    const getNearestCoffeeShop = useCallback((lat, lng) => {
        const distance = locations.map((item, index) => {
            return getDistance([item.latLog?.lat, item.latLog?.lng], [lat, lng])
        })
        const index = distance.findIndex(el => el === Math.min(...distance));
        const nearestCoffeeShop = locations[index];
        setNearestCoffeeShop(nearestCoffeeShop);
        return nearestCoffeeShop;
    }, [cords])


    //fetching and drawing the route
    const getRoutePoints = useCallback((fromCords, toCords) => {
        setLoading(true);
        setRoutes([]);
        axios({
            method: "get",
            url: `https://${baseURL}/routing/1/calculateRoute/${fromCords[0]},${fromCords[1]}:${toCords[0]},${toCords[1]}/json?key=${API_KEY}`,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            const legs = response.data.routes;
            legs && legs.forEach(function (value) {
                const tempData = value.legs;
                tempData && tempData.map((item) => {
                    const points = item.points;
                    setRoutes(item.points);
                })
            })
        })
            .catch(err => console.log("err", err))
            .finally(() => setLoading(false))
    }, [routes])

    useEffect(() => {
        let map = L.map(mapRef.current,
            { attributionControl: false }
        ).setView([initCenter?.lat, initCenter?.lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            L.circle([lat, lng], { radius: 500 }).addTo(map);
            const data = getNearestCoffeeShop(lat, lng);
            fromCords = [lat, lng];
            const toCords = [data.latLog?.lat, data.latLog?.lng];
            getRoutePoints(fromCords, toCords);
            setCords([lat, lng]);
        })
        // Set Markers
        locations.map((item) => {
            const marker = L.marker([item.latLog?.lat, item.latLog?.lng], { icon: item.icon })
                .bindPopup(item.name)
                .addTo(map)
            marker.on("click", (e) => markerCliked(e))
        })
        setMap(map);
        return () => map.remove();
    }, [])

    useEffect(() => {
        if (map) {
            let wayPoints = [];
            routes && routes.map((i) =>
                wayPoints.push([i.latitude, i.longitude])
            );
            routes.map((latLng) => {
                if (polyLine) polyLine.remove(map);
                polyLine = new L.polyline([wayPoints]).addTo(map);
            })
        }
    }, [routes])

    const markerCliked = (e) => {
        const { lat, lng } = e.latlng;
        const toCords = [lat, lng];
        if (fromCords?.length) {
            getRoutePoints(fromCords, toCords)
        }
    }

    return (
        <div className="App">
            <div style={{ padding: 0, margin: 0, width: "100%", height: "100vh", }}
                ref={el => mapRef.current = el}>
            </div>
        </div>
    );
}

export default App;
