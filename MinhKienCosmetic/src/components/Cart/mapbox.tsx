import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2llbjIyMDEiLCJhIjoiY200dHljMXZiMGQ3YzJrc2FvcXFteDdydyJ9.FxrMt6IPJAOq5CZGIHBatA';
interface AddressMapProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
}

const AddressMap: React.FC<AddressMapProps> = ({ onAddressSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [106.660172, 10.762622], // Default: Hanoi
        zoom: 12,
        attributionControl: false,
      });

      setMap(mapInstance);

      mapInstance.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setLocation([lng, lat]);

        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.features && data.features.length > 0) {
              const address = data.features[0].place_name;
              onAddressSelect(address, [lng, lat]);
            }
          })
          .catch((err) => console.error('Error fetching address:', err));
      });

      return () => mapInstance.remove();
    }
  }, []);

  const handleSearch = () => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        search
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setLocation([lng, lat]);
          map?.flyTo({ center: [lng, lat], zoom: 14 });
          onAddressSelect(data.features[0].place_name, [lng, lat]);
        }
      })
      .catch((err) => console.error('Error searching location:', err));
  };

  return (
    <div className="address-map">
      <div className="mb-[8px] flex">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nhập địa chỉ..."
          className="rounded-lg border px-3 py-2"
        />
        <button
          onClick={handleSearch}
          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
        >
          Tìm kiếm
        </button>
      </div>
      <div
        ref={mapContainerRef}
        className="mt-4 rounded-lg border border-gray-300"
        style={{ height: '400px', width: '100%' }}
      ></div>
    </div>
  );
};

export default AddressMap;
