/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map: google.maps.Map, heatmap: google.maps.visualization.HeatmapLayer;

type Disaster = {
  id: string,
  disasterId: string,
  title: string,
  countOfVictim: number,
  avgLongitude: number,
  avgLatitude: number
}

type HeatMapItem = {
  id: string,
  disasterId: string,
  longitude: number,
  latitude: number
}

let disaster: Disaster;
let disasters: Disaster[]; 

function initDisaster(): void {
  const headers: Headers = new Headers()
  // Add a few headers
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', '*')

  const request: RequestInfo = new Request('http://ms-heat-map-oc-service-dxl.apps.mbt.vodafone.local/heat/map', {
    method: 'GET',
    headers: headers
  })

  const select = document.getElementById("disaster-combo") !as HTMLSelectElement
  select.dispatchEvent(new Event('change'))

  fetch(request).then(res => res.json()).then(res => {
    disasters = res as Disaster[]
    disaster = disasters[1]
    disasters.forEach(dis => {
      var option = new Option(dis.title, dis.disasterId);
      select.appendChild(option);
    })
   
    initMap();
  })
}
function initMap(): void {
  document
  .getElementById("toggle-heatmap")!
  .addEventListener("click", toggleHeatmap);
document
  .getElementById("change-gradient")!
  .addEventListener("click", changeGradient);
document
  .getElementById("change-opacity")!
  .addEventListener("click", changeOpacity);
document
  .getElementById("change-radius")!
  .addEventListener("click", changeRadius);
  const headers: Headers = new Headers()
  // Add a few headers
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', '*')
  headers.set('disasterId', disaster.disasterId)

  const request: RequestInfo = new Request('http://ms-heat-map-oc-service-dxl.apps.mbt.vodafone.local/heat/map/specified', {
    method: 'GET',
    headers: headers
  })

  fetch(request).then(res => res.json()).then(res => {
    const heatMapItems = res as HeatMapItem[]
    console.log(heatMapItems)
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 13,
      center: { lat: disaster.avgLatitude, lng: disaster.avgLongitude},
      mapTypeId: "satellite",
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapItems.map(heat => new google.maps.LatLng(heat.latitude, heat.longitude)).reverse(),
      map: map,
    });
  })
}

function handleMap(): void {
  const select = document.getElementById("disaster-combo") !as HTMLSelectElement
  var disasterId = select.value
  const headers: Headers = new Headers()
  // Add a few headers
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', '*')
  headers.set('disasterId', disasterId)

  const request: RequestInfo = new Request('http://ms-heat-map-oc-service-dxl.apps.mbt.vodafone.local/heat/map/specified', {
    method: 'GET',
    headers: headers
  })

  const specifiedDisaster = disasters.findLast(dis => dis.disasterId === disasterId)

  console.log(disasterId)
  console.log("specified disaster = " + specifiedDisaster)

  fetch(request).then(res => res.json()).then(res => {
    const heatMapItems = res as HeatMapItem[]
    console.log(heatMapItems)
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 13,
      center: { lat: specifiedDisaster!.avgLatitude, lng: specifiedDisaster!.avgLongitude},
      mapTypeId: "satellite",
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapItems.map(heat => new google.maps.LatLng(heat.latitude, heat.longitude)).reverse(),
      map: map,
    });
  })

}

function toggleHeatmap(): void {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient(): void {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius(): void {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity(): void {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}

declare global {
  interface Window {
    initDisaster: () => void;
    handleMap: () => void;
    disaster: Disaster;
    disasters: Disaster[];
  }
}

window.initDisaster = initDisaster;
window.handleMap = handleMap;
export {};
