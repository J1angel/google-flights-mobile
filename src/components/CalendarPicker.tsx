import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';

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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Travel Date</Text>
            
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                onPress={goToPreviousMonth} 
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
              
              <View style={styles.monthContainer}>
                <Text style={styles.monthText}>{monthName}</Text>
                <TouchableOpacity 
                  onPress={goToToday} 
                  style={styles.todayButton}
                >
                  <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={goToNextMonth} 
                style={styles.navButton}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View style={styles.dayNamesContainer}>
              {dayNames.map((day, index) => (
                <View key={index} style={styles.dayNameCell}>
                  <Text style={styles.dayNameText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {days.map((day, index) => (
                <View key={index} style={styles.dayCell}>
                  {day ? (
                    <TouchableOpacity
                      style={[
                        styles.dayButton,
                        isToday(day) && styles.todayDayButton,
                        isSelected(day) && styles.selectedButton,
                        isPast(day) && styles.pastButton
                      ]}
                      onPress={() => selectDate(day)}
                      disabled={isPast(day)}
                    >
                      <Text style={[
                        styles.dayText,
                        isToday(day) && styles.todayText,
                        isSelected(day) && styles.selectedText,
                        isPast(day) && styles.pastText
                      ]}>
                        {day.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyCell} />
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  monthContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  todayButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dayCell: {
    width: '14.28%',
    height: 48,
    marginBottom: 8,
  },
  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  todayDayButton: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  selectedButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pastButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#f3f4f6',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  todayText: {
    color: '#d97706',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pastText: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptyCell: {
    flex: 1,
    marginHorizontal: 2,
  },
  cancelButton: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
}); 