import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import reactorsData from './data/reactors.json';
import chokepointsData from './data/chokepoints.json';
import type { SelectedFacility } from './lib/facilities';

// Minimal bounds covering the globe without wrapping indefinitely
const MAX_BOUNDS: L.LatLngBoundsExpression = [
  [-90, -180],
  [90, 180]
];

interface MapComponentProps {
  onSelectPlant: (plant: SelectedFacility) => void;
  filterTypes: {
    operational: boolean;
    construction: boolean;
    shutdown: boolean;
  };
  timelineYear: number;
  showChokepoints?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ onSelectPlant, filterTypes, timelineYear, showChokepoints = false }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [20, 10],
      zoom: 2,
      minZoom: 1.5,
      maxBounds: MAX_BOUNDS,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark carto/stamen or basic dark tile layer (no labels for higher contrast)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;

    layerGroup.clearLayers();

    if (showChokepoints) {
      chokepointsData.forEach((forge) => {
        const icon = L.divIcon({
          className: 'leaflet-marker-wrapper',
          html: `<div class="nuclear-marker" style="background: var(--accent); box-shadow: 0 0 10px rgba(0, 255, 255, 0.5)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([forge.lat, forge.lng], { icon });

        marker.on('click', () => {
          onSelectPlant(forge);
          mapRef.current?.flyTo([forge.lat, forge.lng], 6, { duration: 1 });
        });

        marker.bindTooltip(`
          <div style="font-family: 'Geist Mono', monospace; font-size: 10px; color: #fff; background: #000; border: 1px solid var(--accent); padding: 4px;">
            ${forge.name}
          </div>
        `, { direction: 'top', offset: [0, -10], opacity: 1 });

        marker.addTo(layerGroup);
      });
    } else {
      reactorsData.forEach((plant) => {
        // Check timeline build year
        if (plant.buildYear > timelineYear) return;

        // Check filters
        const statusLower = plant.status.toLowerCase();
        if (statusLower === 'operational' && !filterTypes.operational) return;
        if (statusLower === 'construction' && !filterTypes.construction) return;
        if (statusLower === 'shutdown' && !filterTypes.shutdown) return;

        // Define marker class based on status
        let markerClass = 'marker-shutdown';
        if (statusLower === 'operational') markerClass = 'marker-operational';
        if (statusLower === 'construction') markerClass = 'marker-construction';

        const icon = L.divIcon({
          className: 'leaflet-marker-wrapper', // Avoid overriding transform on the leaflet wrapper
          html: `<div class="nuclear-marker ${markerClass}"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([plant.lat, plant.lng], { icon });

        marker.on('click', () => {
          onSelectPlant(plant);
          mapRef.current?.flyTo([plant.lat, plant.lng], 6, { duration: 1 });
        });

        // Hover tooltip for better desktop experience
        marker.bindTooltip(`
          <div style="font-family: 'Geist Mono', monospace; font-size: 10px; color: #fff; background: #000; border: 1px solid #333; padding: 4px;">
            ${plant.name}
          </div>
        `, { direction: 'top', offset: [0, -10], opacity: 1 });

        marker.addTo(layerGroup);
      });
    }

  }, [onSelectPlant, filterTypes, timelineYear, showChokepoints]);

  return <div ref={containerRef} className="map-container" />;
};

export default MapComponent;
