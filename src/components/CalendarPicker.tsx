import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';

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
        style={styles.input}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
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
              <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
                <Text style={styles.navText}>‹</Text>
              </TouchableOpacity>
              
              <View style={styles.monthContainer}>
                <Text style={styles.monthText}>{monthName}</Text>
                <TouchableOpacity onPress={goToToday} style={styles.todayNavButton}>
                  <Text style={styles.todayNavText}>Today</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
                <Text style={styles.navText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day Names */}
            <View style={styles.dayNames}>
              {dayNames.map((day, index) => (
                <Text key={index} style={styles.dayName}>{day}</Text>
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
                        isToday(day) && styles.todayButton,
                        isSelected(day) && styles.selectedButton,
                        isPast(day) && styles.pastButton,
                      ]}
                      onPress={() => selectDate(day)}
                      disabled={isPast(day)}
                    >
                      <Text style={[
                        styles.dayText,
                        isToday(day) && styles.todayText,
                        isSelected(day) && styles.selectedText,
                        isPast(day) && styles.pastText,
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
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  navText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  monthContainer: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todayNavButton: {
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  todayNavText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  dayNames: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayButton: {
    backgroundColor: '#fff3e0',
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  todayText: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#2196f3',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pastButton: {
    backgroundColor: '#f5f5f5',
  },
  pastText: {
    color: '#ccc',
  },
  emptyCell: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
}); 