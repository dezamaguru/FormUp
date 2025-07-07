"use client";
import './CustomMap.css'
import { useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
} from "@vis.gl/react-google-maps";

function GoogleMapComponent() {
    const center = { lat: 44.44762, lng: 26.0979 };

    const institutii = [
        {
            lat: 44.44762, lng: 26.0979,
            nume: "Academia de Studii Economice din București",
            descriere: "Facultatea de Cibernetică, Statistică și Informatică Economică"
        }
    ];

    const [selectedIndex, setSelectedIndex] = useState(null);

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div className='map' style={{ height: "100vh", width: "100%" }}>
                <Map zoom={15} center={center} mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
                    style={{ height: "100%", width: "100%", cursor: "grab" }}>
                    {institutii.map((loc, index) => (
                        <AdvancedMarker
                            key={index}
                            position={{ lat: loc.lat, lng: loc.lng }}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <Pin
                                background="red"
                                borderColor="#8B0000"
                                glyphColor="black"
                            />

                        </AdvancedMarker>
                    ))}

                    {selectedIndex !== null && (
                        <InfoWindow
                            position={{
                                lat: institutii[selectedIndex].lat,
                                lng: institutii[selectedIndex].lng
                            }}
                            onCloseClick={() => setSelectedIndex(null)}
                        >
                            <div>
                                <strong>{institutii[selectedIndex].nume}</strong><br />
                                {institutii[selectedIndex].descriere}
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}

export default GoogleMapComponent;
