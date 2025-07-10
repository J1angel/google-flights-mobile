import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function CalendarPicker({ value, onChange, placeholder = "Select Date" }: CalendarPickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const selectedDate = value ? new Date(value) : null;

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date: Date) => {
    return date < today;
  };

  const selectDate = (date: Date) => {
    if (isPast(date)) {
      Alert.alert('Error', 'Please select a future date');
      return;
    }
    onChange(formatDate(date));
    setIsVisible(false);
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 bg-white"
        onPress={() => setIsVisible(true)}
      >
        <Text className={`text-base ${!value ? 'text-gray-500' : 'text-gray-800'}`}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12 max-w-sm">
            <Text className="text-lg font-bold text-center mb-5 text-gray-800">Select Travel Date</Text>
            
            {/* Calendar Header */}
            <View className="flex-row items-center justify-between mb-5">
              <TouchableOpacity onPress={goToPreviousMonth} className="w-10 h-10 justify-center items-center rounded-full bg-gray-100">
                <Text className="text-xl font-bold text-gray-800">‹</Text>
              </TouchableOpacity>
              
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">{monthName}</Text>
                <TouchableOpacity onPress={goToToday} className="mt-1 px-3 py-1 bg-blue-600 rounded-xl">
                  <Text className="text-xs text-white font-semibold">Today</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={goToNextMonth} className="w-10 h-10 justify-center items-center rounded-full bg-gray-100">
                <Text className="text-xl font-bold text-gray-800">›</Text>
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View className="flex-row mb-2.5">
              {dayNames.map((day, index) => (
                <Text key={index} className="flex-1 text-center text-sm font-semibold text-gray-600">{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap mb-5">
              {days.map((day, index) => (
                <View key={index} className="w-1/7 aspect-square p-0.5">
                  {day ? (
                    <TouchableOpacity
                      className={`flex-1 justify-center items-center rounded-lg ${
                        isToday(day) ? 'bg-orange-50 border-2 border-orange-500' : ''
                      } ${
                        isSelected(day) ? 'bg-blue-600' : ''
                      } ${
                        isPast(day) ? 'bg-gray-100' : 'bg-white'
                      }`}
                      onPress={() => selectDate(day)}
                      disabled={isPast(day)}
                    >
                      <Text className={`text-base ${
                        isToday(day) ? 'text-orange-500 font-bold' : ''
                      } ${
                        isSelected(day) ? 'text-white font-bold' : ''
                      } ${
                        isPast(day) ? 'text-gray-300' : 'text-gray-800'
                      }`}>
                        {day.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="flex-1" />
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="mt-4 p-4 bg-gray-50 rounded-lg items-center"
              onPress={() => setIsVisible(false)}
            >
              <Text className="text-base text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
} 