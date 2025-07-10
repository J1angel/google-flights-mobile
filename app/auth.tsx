import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../src/store';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  signUpStart, 
  signUpSuccess, 
  signUpFailure,
  setSignUpMode 
} from '../src/features/auth/authSlice';
import { useState } from 'react';

export default function Auth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const handleSignUp = () => {
    if (!formData.name || !formData.username || !formData.password) {
      dispatch(signUpFailure('Please fill in all fields'));
      return;
    }

    if (formData.password.length < 6) {
      dispatch(signUpFailure('Password must be at least 6 characters'));
      return;
    }

    dispatch(signUpStart());
    setTimeout(() => {
      const userData = {
        id: '1',
        username: formData.username,
        name: formData.name
      };
      dispatch(signUpSuccess(userData));
      setFormData({ name: '', username: '', password: '' });
    }, 1000);
  };

  const handleLogin = () => {
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Please fill in username and password'));
      return;
    }

    dispatch(loginStart());
    setTimeout(() => {
      const userData = {
        id: '1',
        username: formData.username,
        name: 'John Doe'
      };
      dispatch(loginSuccess(userData));
      setFormData({ name: '', username: '', password: '' });
    }, 1000);
  };

  const toggleMode = () => {
    dispatch(setSignUpMode(!auth.isSignUpMode));
    setFormData({ name: '', username: '', password: '' });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {auth.isSignUpMode ? 'Create Account' : 'Welcome Back'}
      </Text>
      
      <View style={styles.authContainer}>
        {auth.isSignUpMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
        </View>

        <Button 
          title={auth.isLoading 
            ? (auth.isSignUpMode ? "Creating Account..." : "Signing In...") 
            : (auth.isSignUpMode ? "Sign Up" : "Sign In")
          } 
          onPress={auth.isSignUpMode ? handleSignUp : handleLogin}
          disabled={auth.isLoading}
        />

        {auth.error && <Text style={styles.error}>Error: {auth.error}</Text>}

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {auth.isSignUpMode ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <Button 
            title={auth.isSignUpMode ? "Sign In" : "Sign Up"} 
            onPress={toggleMode}
          />
        </View>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  authContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 