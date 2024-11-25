import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Alert,FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { API_ENDPOINTS } from "../../component/config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function BookingSummary({ route, navigation }) {
    const { bookingId, latitude, longitude } = route.params; // Extracting the id, lat, and lng from route params
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [attachments, setAttachments] = useState([]);
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

   

    console.log("Latitude: ", latitude, "Longitude: ", longitude); // Debugging location

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-#F4EEF3`}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }


    const handlePhotoUpload = async (type) => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
    
        if (type === 'camera') {
            launchCamera(options, async (response) => {
                if (response.didCancel) {
                    console.log('User canceled image picker');
                } else if (response.errorMessage) {
                    console.error('Image picker error: ', response.errorMessage);
                } else if (response.assets) {
                    const photoUri = response.assets[0].uri;
                    const bookingId = route.params.bookingId; // Use the booking ID passed to the screen
                    setPhotos([...photos, photoUri]); // Update state
                    await uploadPhoto(photoUri, bookingId); // Upload photo
                }
            });
        } else if (type === 'gallery') {
            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log('User canceled image picker');
                } else if (response.errorMessage) {
                    console.error('Image picker error: ', response.errorMessage);
                } else if (response.assets) {
                    const photoUri = response.assets[0].uri;
                    console.log(photoUri)
                    const bookingId = route.params.bookingId; // Use the booking ID passed to the screen
                    setPhotos([...photos, photoUri]); // Update state
                    await uploadPhoto(photoUri, bookingId); // Upload photo
                }
            });
        }
    };
    
    const uploadPhoto = async (photoUri, id) => {
        const formData = new FormData();
        const fileName = `photo_${id}.jpg`; // Dynamically set the file name based on the ID
    
        formData.append('file', {
            uri: photoUri,
            name: fileName, // Set the file name dynamically
            type: 'image/jpeg', // Adjust based on the image format
        });
    
        try {
            const token = await AsyncStorage.getItem('token'); // Get your authentication token if needed
            // const uploadUrl = `${API_ENDPOINTS.UPLOAD_PHOTO}/${id}`; // Append the ID to the endpoint URL
            const uploadUrl = `${API_ENDPOINTS.UPLOAD_PHOTO}/10`;
            const response = await axios.post(
                uploadUrl,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`, // Add token if required
                    },
                }
            );
    
            if (response.status === 200) {
                console.log('Photo uploaded successfully:', response.data);
                Alert.alert('Success', 'Photo uploaded successfully');
            } else {
                console.error('Failed to upload photo:', response.data);
                Alert.alert('Error', 'Failed to upload photo');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'An error occurred while uploading the photo');
        }
    };
    const fetchAttachments = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_ENDPOINTS.FETCH_ATTACHMENTS}/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAttachments(response.data.attachments); // Assume API returns a list of attachment URLs
        } catch (error) {
            console.error("Error fetching attachments:", error);
        }
    };
    // const fetchAttachment=()=>{
    //     fetch('')
    //     .then(res=>res.json())
    //     .then(res=>res.data)
    //     .catch(error=>console.log(error))
    // }
    
        
    useEffect(() => {
        fetchBookingDetails();
        fetchAttachments();
    }, [bookingId, latitude, longitude]);

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
                        source={{ uri: bookingData.service_center_image }}
                        style={tw`w-full h-48`}
                    />
                    <View style={tw`absolute inset-0 bg-[#F4EEF3] opacity-60`} />
                    <TouchableOpacity
                        style={tw`absolute top-14 left-4`}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={tw`text-white text-lg`}>{"<"}</Text>
                    </TouchableOpacity>
                    {/* <Text style={tw`absolute top-14 left-12 text-gray-500 text-xl font-bold`}>
                        BOOKING SUMMARY
                    </Text> */}
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
               

                {/* Map View */}
                {/* Attachments */}
                <View style={tw`p-4`}>
                    <Text style={tw`text-gray-900 text-lg mb-2`}>Attachments</Text>
                    <FlatList
                        data={attachments}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.url }}
                                style={tw`w-32 h-32 mr-2 rounded-lg`}
                            />
                        )}
                    />
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={tw`flex-row justify-around items-center px-4 absolute bottom-1 w-full`}>
    {/* Reject Button */}
    <TouchableOpacity
        onPress={() => {
            setActionType('Reject');
            setModalVisible(true);
        }}
        style={tw`bg-red-500 flex-1 p-4 mx-2 rounded-lg`}
    >
        <Text style={tw`text-white text-lg text-center`}>Reject</Text>
    </TouchableOpacity>

    {/* Approve Button */}
    <TouchableOpacity
        onPress={() => {
            setActionType('Approve');
            setModalVisible(true);
        }}
        style={tw`bg-green-500 flex-1 p-4 mx-2 rounded-lg`}
    >
        <Text style={tw`text-white text-lg text-center`}>Approve</Text>
    </TouchableOpacity>

    {/* Upload Photos Button */}
    <TouchableOpacity
            onPress={() => setPhotoModalVisible(true)}
            style={tw`bg-blue-500 flex-row items-center justify-center p-4 mx-2 rounded-lg`}
        >
            <Icon name="camera" size={20} color="white" style={tw`mr-2`} /> {/* Camera icon */}
            {/* <Text style={tw`text-white text-lg`}>Upload Photos</Text> */}
        </TouchableOpacity>
</View>


            <Modal
                // transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => setPhotoModalVisible(false)}
            >
                <View style={tw`flex-1 justify-center items-center bg-gray-500 opacity-70`}>
                    <View style={tw`bg-white p-8 rounded-lg`}>
                        <Text style={tw`text-lg font-bold`}>Upload Photos</Text>
                        <View style={tw`mt-4`}>
                            <TouchableOpacity
                                onPress={() => handlePhotoUpload('camera')}
                                style={tw`bg-blue-500 p-4 rounded-lg mb-4`}
                            >
                                <Text style={tw`text-white text-center`}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handlePhotoUpload('gallery')}
                                style={tw`bg-blue-500 p-4 rounded-lg mb-4`}
                            >
                                <Text style={tw`text-white text-center`}>Choose from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPhotoModalVisible(false)}
                                style={tw`bg-red-500 p-4 rounded-lg`}
                            >
                                <Text style={tw`text-white text-center`}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
