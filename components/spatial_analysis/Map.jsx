'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';

// Your custom icon
const customIcon = new L.Icon({
  iconUrl: '/frenchMarker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to add markers to the map manually with clustering
function MarkerCluster({ entities }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();

        // Scale size based on count
        const size =  count < 10 ? 30 : count < 50 ? 40 : 50;

        return L.divIcon({
          html: `<div class="custom-cluster-icon" style="
            width: ${size}px;
            height: ${size}px;
            line-height: ${size}px;
            background-color: #13452D;
            border: 2px solid #13452D;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            text-align: center;
          ">${count}</div>`,
          className: 'marker-cluster', // Required class to retain clustering behavior
          iconSize: [size, size],
        });
      },
    });

    entities.forEach((entity) => {
      const marker = L.marker([entity.latitude, entity.longitude], {
        icon: customIcon,
      }).bindPopup(entity.label);

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [entities, map]);

  return null;
}


export default function MapComponent({ entities }) {
  return (
    <MapContainer
      center={[46.603354, 1.888334]}
      zoom={6}
      minZoom={6}
      scrollWheelZoom={false}
      maxBounds={[[41.0, -5.0], [51.5, 10.0]]}
      maxBoundsViscosity={1.0}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerCluster entities={entities} />
    </MapContainer>
  );
}
