# Google Flights Mobile App

A React Native mobile application that allows users to search for flights using the Sky Scrapper API from RapidAPI.

## Features

- User authentication (sign-up/login)
- Flight search with airport autocomplete
- Real-time flight data from Sky Scrapper API
- Flight selection and booking simulation
- Modern UI with React Native and Expo Router

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get RapidAPI Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up or log in to your account
3. Subscribe to the [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper)
4. Copy your API key from the dashboard

### 3. Configure API Key

Open `src/config/api.ts` and replace `'YOUR_RAPIDAPI_KEY'` with your actual RapidAPI key:

```typescript
export const API_CONFIG = {
  RAPIDAPI_KEY: 'your_actual_api_key_here',
  RAPIDAPI_HOST: 'sky-scanner1.p.rapidapi.com',
  BASE_URL: 'https://sky-scanner1.p.rapidapi.com',
};
```

### 4. Start the Development Server

```bash
npx expo start
```

### 5. Run on Device/Simulator

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
google-flights-mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with Redux Provider
│   ├── index.tsx          # Auth router (login/signup)
│   ├── auth.tsx           # Authentication page
│   └── home.tsx           # Homepage with flight search
├── src/
│   ├── config/
│   │   └── api.ts         # API configuration
│   ├── features/
│   │   ├── auth/          # Authentication Redux slice
│   │   └── flights/       # Flights Redux slice
│   ├── services/
│   │   └── flightsApi.ts  # Sky Scrapper API service
│   └── store/
│       └── index.ts       # Redux store configuration
├── package.json
└── README.md
```

## API Integration Steps

### Step 1: Basic API Setup ✅
- Created API service with axios
- Configured RapidAPI headers
- Set up API configuration file

### Step 2: Flight Search API ✅
- Implemented `searchFlights` function
- Added flight data interfaces
- Integrated with Redux store
- Added fallback mock data for development

### Step 3: Airport Autocomplete ✅
- Implemented `getAirports` function
- Added airport search functionality
- Created airport selection UI
- Added fallback airport data for development

### Step 4: Flight Display ✅
- Created flight card components
- Added flight selection functionality
- Implemented error handling
- Added loading states and user feedback

## Usage

1. **Sign Up/Login**: Create an account or log in to access the app
2. **Search Flights**: 
   - Enter origin and destination airports (with autocomplete)
   - Select travel date
   - Choose number of passengers
   - Tap "Search Flights"
3. **View Results**: Browse available flights with prices, times, and airline information
4. **Select Flight**: Tap on a flight to select it and view details

## API Endpoints Used

### Primary Endpoints (v1)
- `GET /flights/v1/quote` - Search for flights
- `GET /flights/v1/autocomplete` - Search for airports

### Fallback Endpoints
- `GET /flights/quote` - Alternative flight search endpoint
- `GET /flights/autocomplete` - Alternative airport search endpoint

The app automatically tries fallback endpoints if the primary v1 endpoints are not available.

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Sky Scrapper API** - Flight data provider

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure you've replaced the placeholder API key in `src/config/api.ts`
2. **API Rate Limiting (429)**: The Sky Scrapper API has rate limits. The app includes fallback data for development
3. **API Endpoint Issues (404)**: Some endpoints may not be available. The app includes fallback data for development
4. **Metro Bundler Issues**: Try clearing the cache with `npx expo start --clear`
5. **Navigation Errors**: Ensure Expo Router is properly configured

### Development Mode

The app includes fallback mock data for airports and flights when the API is not available or when you haven't configured your API key. This allows you to test the app functionality without setting up the API immediately.

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [Sky Scrapper API documentation](https://rapidapi.com/apiheya/api/sky-scrapper)
- Check the console for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect the terms of service for the Sky Scrapper API. 