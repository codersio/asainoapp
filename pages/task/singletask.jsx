import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { API_ENDPOINTS } from "../../component/config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

export default function BookingSummary({ route, navigation }) {
    const { bookingId, latitude, longitude } = route.params; // Extracting the id, lat, and lng from route params
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);

    const fetchBookingDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.error("No token found in AsyncStorage");
                return;
            }

            const response = await axios.get(`${API_ENDPOINTS.CALLASSIGNID}/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    latitude: latitude,
                    longitude: longitude,
                }
            });

            setBookingData(response.data.data);
        } catch (error) {
            console.error("Error fetching booking details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId, latitude, longitude]);

    console.log("Latitude: ", latitude, "Longitude: ", longitude); // Debugging location

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-#F4EEF3`}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!bookingData) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-#F4EEF3`}>
                <Text style={tw`text-red-500 text-lg`}>Failed to load booking details.</Text>
            </View>
        );
    }

    return (
        <View style={tw`bg-#F4EEF3 flex-1`}>
            <ScrollView style={tw`bg-#F4EEF3 flex-1`}>
                {/* Header */}
                <View style={tw`relative`}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/500x300' }}
                        style={tw`w-full h-48`}
                    />
                    <View style={tw`absolute inset-0 bg-[#F4EEF3] opacity-60`} />
                    <TouchableOpacity
                        style={tw`absolute top-14 left-4`}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={tw`text-white text-lg`}>{"<"}</Text>
                    </TouchableOpacity>
                    <Text style={tw`absolute top-14 left-12 text-gray-500 text-xl font-bold`}>
                        BOOKING SUMMARY
                    </Text>
                </View>

                {/* Service Details */}
                <View style={tw`p-4`}>
                    <Text style={tw`text-gray-900 text-lg mb-2`}>Service Details</Text>
                    <View style={tw`bg-white p-4 rounded-lg`}>
                        <Text style={tw`text-gray-900 text-lg font-bold`}>
                            {bookingData.serial_no || "N/A"}
                        </Text>
                        <Text style={tw`text-gray-600`}>
                            Call no: {bookingData.call_no || "N/A"}{'\n'}
                            Service: {bookingData.reason || "N/A"}{'\n'}
                            Model: {bookingData.model || "N/A"}{'\n'}
                            Distance: {bookingData.distance || "N/A"}
                        </Text>
                    </View>
                </View>

                {/* Customer Details */}
                <View style={tw`p-4`}>
                    <Text style={tw`text-gray-900 text-lg mb-2`}>Customer Details</Text>
                    <View style={tw`bg-white p-4 rounded-lg flex-row`}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/60' }}
                            style={tw`w-14 h-14 rounded-full`}
                        />
                        <View style={tw`ml-4`}>
                            <Text style={tw`text-gray-600 font-bold text-lg`}>
                                {bookingData.customer_name || "N/A"}
                            </Text>
                            <Text style={tw`text-gray-500`}>
                                Phone: {bookingData.phone || "N/A"}{'\n'}
                                Alt Phone: {bookingData.phone_two || "N/A"}{'\n'}
                                Pincode: {bookingData.pin || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Location */}
                <TouchableOpacity
                    style={tw`bg-blue-500 p-4 rounded-lg mt-4`}
                    onPress={() => setMapVisible(!mapVisible)}
                >
                    <Text style={tw`text-white text-lg text-center`}>Show Location on Map</Text>
                </TouchableOpacity>

                {/* Map View */}
                <MapView
                    provider="google"
                    style={{ flex: 1, backgroundColor: 'red' }}
                    initialRegion={{
                        latitude: 22.4784465,
                        longitude: 88.3241582,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker coordinate={{ latitude: 22.4784465, longitude: 88.3241582 }} />
                </MapView>
            </ScrollView>

            {/* Action Buttons */}
            <View style={tw`flex-row justify-between px-4 absolute bottom-0 w-full`}>
                <TouchableOpacity
                    onPress={() => {
                        setActionType('Reject');
                        setModalVisible(true);
                    }}
                    style={tw`bg-red-500 p-4 rounded-lg`}
                >
                    <Text style={tw`text-white text-lg`}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setActionType('Approve');
                        setModalVisible(true);
                    }}
                    style={tw`bg-green-500 p-4 rounded-lg`}
                >
                    <Text style={tw`text-white text-lg`}>Approve</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={tw`flex-1 justify-center items-center bg-gray-500 opacity-70`}>
                    <View style={tw`bg-white p-8 rounded-lg`}>
                        <Text style={tw`text-lg font-bold`}>Are you sure you want to {actionType} this request?</Text>
                        <View style={tw`flex-row mt-4`}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    // Handle approve or reject action
                                }}
                                style={tw`bg-green-500 p-4 rounded-lg w-32 mr-4`}
                            >
                                <Text style={tw`text-white text-center`}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={tw`bg-red-500 p-4 rounded-lg w-32`}
                            >
                                <Text style={tw`text-white text-center`}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
