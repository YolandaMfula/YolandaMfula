# MoodWeather

## Overview

MoodWeather is a web application that combines mood tracking with weather data to help users explore potential correlations between their emotional state and environmental conditions. The app allows users to log their daily moods, view real-time weather information for any city, and visualize their mood patterns through interactive charts and galleries. Built as a client-side web application with a lightweight Express.js backend, it features user authentication, data persistence, and GitHub integration for project sharing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, and JavaScript with Chart.js for data visualization
- **Architecture Pattern**: Multi-page application (MPA) with modular JavaScript files
- **UI Components**: Responsive design with card-based layouts and dark/light theme support
- **Navigation**: Static navigation across 7 main pages (Home, Login, Gallery, History, About, Contact, Reflection)

### Backend Architecture
- **Server Framework**: Express.js with ES6 modules
- **API Design**: RESTful endpoints for weather API key management and GitHub integration
- **Authentication**: Client-side authentication using localStorage (demo implementation)
- **Data Flow**: Frontend-heavy architecture with minimal backend processing

### Data Storage Solutions
- **Primary Storage**: Browser localStorage for user data and mood history
- **Data Structure**: JSON-based storage with user-specific keys for mood entries
- **Session Management**: localStorage-based user sessions without server-side validation
- **Rationale**: Chosen for simplicity and demonstration purposes, avoiding database setup complexity

### Authentication and Authorization
- **Authentication Method**: Simple client-side authentication with username/password
- **Session Management**: localStorage-based sessions with user profile data
- **User Class**: Object-oriented approach with User class for mood history management
- **Security Note**: Demo-level security suitable for educational purposes

### External Dependencies
- **Chart.js**: Data visualization library for mood analytics and trend charts
- **OpenWeatherMap API**: Real-time weather data integration with temperature, conditions, and location information
- **GitHub API**: Repository creation and file upload functionality via Octokit
- **Express.js**: Lightweight web server for static file serving and API endpoints

## External Dependencies

### Weather API Integration
- **Service**: OpenWeatherMap API for current weather conditions
- **Authentication**: API key stored in environment variables and served via backend endpoint
- **Features**: City-based weather lookup, temperature, humidity, wind speed, and weather descriptions
- **Error Handling**: Comprehensive error handling for invalid cities and API failures

### GitHub Integration
- **Service**: GitHub API via Octokit for repository management
- **Authentication**: OAuth-based authentication through Replit's connector system
- **Features**: Automatic repository creation and project file upload
- **Use Case**: Allows users to export their MoodWeather project to their GitHub account

### Third-Party Libraries
- **Chart.js**: Client-side charting library for mood visualization (doughnut charts)
- **Octokit**: GitHub API client for repository operations
- **Express**: Web application framework for backend services

### Development Dependencies
- **Node.js**: Runtime environment for backend services
- **ES6 Modules**: Modern JavaScript module system for code organization
- **npm**: Package management for external dependencies