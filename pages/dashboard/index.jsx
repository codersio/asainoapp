import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Footer from '../../component/footer';

// const Stack = createNativeStackNavigator();
const App = () => {
  // Sample data
  const tasks = [
    {
      id: '1',
      title: 'Service kondensor AC dan tiga kipas angin',
      timeLeft: '16 hours left',
      distance: '4.5 km',
      status: 'In Progress',
      time: '3h',
    },
    {
      id: '2',
      title: 'Service kondensor AC dan tiga kipas angin',
      timeLeft: '1 day, 4 hours left',
      distance: '4.5 km',
      status: 'Assigned',
      time: '35m',
    },
  ];

  // Status Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return tw`bg-yellow-200 text-yellow-600`;
      case 'Assigned':
        return tw`bg-red-200 text-red-600`;
      default:
        return tw`bg-gray-200 text-gray-600`;
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg font-bold`}>
          Welcome, <Text style={tw`text-orange-500`}>Steven</Text>
        </Text>
        <TouchableOpacity>
          <Text style={tw`text-gray-500 text-xl`}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Status Cards */}
      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`flex-1 bg-green-100 p-4 rounded-lg mr-2`}>
          <Text style={tw`text-sm text-gray-500`}>My Status</Text>
          <Text style={tw`text-lg font-bold text-green-600`}>Active</Text>
        </View>
        <View style={tw`flex-1 bg-blue-100 p-4 rounded-lg ml-2`}>
          <Text style={tw`text-sm text-gray-500`}>Total work hours</Text>
          <Text style={tw`text-lg font-bold text-blue-600`}>32h</Text>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-white p-4 rounded-lg mb-4 shadow`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-gray-500 text-sm`}>Task #{item.id}</Text>
              <View style={[tw`px-2 py-1 rounded-full`, getStatusBadge(item.status)]}>
                <Text style={tw`text-xs font-bold`}>{item.status}</Text>
              </View>
            </View>
            <Text style={tw`text-base font-bold mb-2`}>{item.title}</Text>
            <Text style={tw`text-gray-500 text-sm`}>{item.timeLeft}</Text>
            <Text style={tw`text-gray-500 text-sm`}>{item.distance}</Text>
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <Footer/>
    </View>
  );
};

export default App;
