'use client';

import { useEffect,useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { X } from 'lucide-react'; // Close icon (if using Lucide)
import VideoBox from './videoBox';
import { viga } from '@/fonts';
import { ThreeDot } from "react-loading-indicators"
import TagsPopup from './tagsPopup';



// Your custom icon
const customIcon = new L.Icon({
  iconUrl: '/frenchMarker.png',
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component to add markers to the map manually with clustering
function MarkerCluster({ entities }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = 40;
        let maxCount = 22;
        const normalized = Math.min(count / maxCount, 1);
        const hue = 120 - normalized * 120;
        const color = `hsl(${hue}, 80%, 45%)`;

        return L.divIcon({
          html: `<div class="custom-cluster-icon" style="
            width: ${size}px;
            height: ${size}px;
            line-height: ${size}px;
            background-color: ${color};
            border: 2px solid ${color};
            border-radius: 50%;
            color: white;
            font-weight: bold;
            text-align: center;
          ">${count}</div>`,
          className: 'marker-cluster',
          iconSize: [size, size],
        });
      },
    });

    entities.forEach((entity) => {
      const marker = L.marker([entity.latitude, entity.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('marker-click', { detail: entity }));
        }
      });

      clusterGroup.addLayer(marker);
      marker.entity = entity;
    });

    map.addLayer(clusterGroup);

    // Zoom into cluster
    clusterGroup.on('clusterclick', function (e) {
      const cluster = e.propagatedFrom;
      const markers = cluster.getAllChildMarkers();
      const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));

      map.fitBounds(bounds, {
        padding: [20, 20],
        animate: true,
        maxZoom: 12,
      });
    });

    // Cluster Hover: emit hovered entity list
    clusterGroup.on('clustermouseover', function (e) {
      const cluster = e.propagatedFrom;
      const markers = cluster.getAllChildMarkers();

      const hovered = markers.map(m => m.entity.id_entite_spatiale);
      //const position = cluster.getLatLng(); // ← position du cluster

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cluster-hover', {
          detail: hovered
        }));
      }
    });

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [entities, map]);

  return null;
}


export default function MapComponent({ entities }) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [hoveredEntities, setHoveredEntities] = useState(null);
  const [entityVideos, setEntityVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const ThreeDotColor = '#13452D'
  const [showTagsPopup,setshowTagsPopup] = useState(true)


  async function getEntityVideos() 
  {
    try 
    {
      const res = await fetch('/api/spatial_analysis/entityVideos',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedEntity }),
      })
      const data = await res.json()

      //console.log('entityVideos  ',data)

      setEntityVideos(data)
      
    } 
    catch (error) 
    {
      console.log('Failing while fetching entityVideos ',error)
    }
  }

  useEffect(() => {
      const handleMarkerClick = (e) => {
        setSelectedEntity(e.detail);
      };

      window.addEventListener('marker-click', handleMarkerClick);

      return () => {
        window.removeEventListener('marker-click', handleMarkerClick);
      };
    }, []);
  
  useEffect(() => {
    if (!selectedEntity) return;

    async function fetchVideos() {
      setVideosLoading(true);
      await getEntityVideos();
      setVideosLoading(false);
      
    }

    fetchVideos();
  }, [selectedEntity]);

  useEffect(() => {
    const handleClusterHover = (e) => {
      if (e.detail) {
        setHoveredEntities(e.detail);
        setshowTagsPopup(true);
        //console.log(e.detail)
      } else {
        setHoveredEntities(null);
      }
    };

    window.addEventListener('cluster-hover', handleClusterHover);
    return () => window.removeEventListener('cluster-hover', handleClusterHover);
  }, []);


  //console.log('HoveredEntities',hoveredEntities)

  return (
    <div className="relative h-screen w-full">

      <div className="relative h-screen w-full">
        <MapContainer
          center={[46.603354, 1.888334]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerCluster
            entities={entities}
            onMarkerClick={(entity) => setSelectedEntity(entity)}
          />

        </MapContainer>

        {/* Tags ToolTip of each cluster */}
        {
          (showTagsPopup) && (hoveredEntities !== null) && <TagsPopup entitiesIds={hoveredEntities} setshow={setshowTagsPopup} />     
        }
      </div>
       
      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] xl:w-[500px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] ${
          selectedEntity ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedEntity && 
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 p-2">
              <h1 className={`${viga.className} text-green1`}>
                {'Videos metioning the location : ' + selectedEntity.label}
              </h1>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-500 hover:text-green1"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className='flex flex-wrap gap-1 p-2'>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-sm bg-[#FF6464] w-[30px] h-[20px]'></div>
                    <h1 className={`${viga.className} text-[#FF6464]`}>Large Channels</h1>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-sm bg-[#64A0FF] w-[30px] h-[20px]'></div>
                    <h1 className={`${viga.className} text-[#64A0FF]`}>Medium Channels</h1>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    <div className='rounded-sm bg-green3 w-[30px] h-[20px]'></div>
                    <h1 className={`${viga.className} text-green3`}>Small Channels</h1>
                </div>
            </div>

            {/* Scrollable video list */}
            <div className="flex flex-col gap-2 overflow-y-auto px-2 pb-4 scrollbar scrollbar-thumb-green1 scrollbar-track-white overflow-x-hidden">
              {videosLoading ? (
              <div className="mt-[200px] ml-[200px]">
                <ThreeDot variant="brick-stack"  size="small" color={ThreeDotColor}/>
              </div>
            
                ):
                  entityVideos.map((video,index)=>
                    <VideoBox
                    key={video.id_video}
                  videoInfos={video} />
                  )
              }
            </div>
          </div>
        }

      </div>

    </div>
  );
}

