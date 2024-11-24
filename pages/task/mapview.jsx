import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import tw from 'tailwind-react-native-classnames';

export default function BookingMapView({ route }) {
    const { bookingData } = route.params; // Pass bookingData with destination coordinates
    const [currentLocation, setCurrentLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const destination = {
        latitude: bookingData.latitude || 37.78825, // Replace with bookingData latitude
        longitude: bookingData.longitude || -122.4324, // Replace with bookingData longitude
    };

    useEffect(() => {
        // Request location permission and fetch current location
        const requestLocation = async () => {
            try {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setErrorMsg(error.message);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    }
                );
            } catch (err) {
                setErrorMsg("Permission denied");
            }
        };

        requestLocation();
    }, []);

    if (!currentLocation) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
                <ActivityIndicator size="large" color="#4CAF50" />
                {errorMsg && <Text style={tw`text-red-500`}>{errorMsg}</Text>}
            </View>
        );
    }

    return (
        <View style={tw`flex-1`}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {/* Destination Marker */}
                <Marker
                    coordinate={destination}
                    title="Destination"
                    description="Booking Location"
                />
                {/* Polyline for Route (optional) */}
                <Polyline
                    coordinates={[currentLocation, destination]}
                    strokeColor="#4CAF50"
                    strokeWidth={3}
                />
            </MapView>
            <View style={tw`p-4 bg-white`}>
                <Text style={tw`text-gray-700 font-bold text-lg`}>
                    Distance: Calculate manually (Add API like Google Directions)
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
