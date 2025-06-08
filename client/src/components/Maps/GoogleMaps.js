import { useEffect } from "react";
import './GoogleMaps.css';

function Map() {
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (document.getElementById("googleMapsScript")) return;

      const script = document.createElement("script");
      script.id = "googleMapsScript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCI9cck_-uDtT_FR59Nh00TaoJo0tQ88Gw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 44.44762, lng: 26.0979 }, 
        zoom: 15,
        mapTypeId: "roadmap",
      });

      const institutii = [
        {
          lat: 44.44762, lng: 26.0979,
          nume: "ASE București",
          descriere: "Academia de Studii Economice din București"
        },
        {
          lat: 46.770439, lng: 23.591423,
          nume: "FSEGA Cluj",
          descriere: "Facultatea de Științe Economice și Gestiunea Afacerilor"
        },
        {
          lat: 47.166, lng: 27.574,
          nume: "FEAA Iași",
          descriere: "Facultatea de Economie și Administrarea Afacerilor Iași"
        }
      ];

      institutii.forEach(loc => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          title: loc.nume,
          animation: window.google.maps.Animation.DROP
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<strong>${loc.nume}</strong><br/>${loc.descriere}`
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    };

    loadGoogleMaps();
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default Map;
