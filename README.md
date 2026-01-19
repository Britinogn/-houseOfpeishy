# House of Peishy - Client Application

> **Where Elegance Meets Empowerment** - A modern beauty salon management platform with elegant styling, appointment booking, and admin dashboard capabilities.

## 🎯 Overview

House of Peishy is a full-stack beauty salon management platform that provides:

- **Public-facing website** for customers to browse services, book appointments, view gallery
- **Admin dashboard** for managing appointments, services, gallery, availability, and profile
- **Integrated booking system** with WhatsApp chat widget
- **Modern, responsive UI** with dark/light theme support
- **Secure authentication** with JWT-based admin access

## ✨ Features

### Public Features
- 🏠 **Home Page** - Elegant landing page with hero section, services showcase, and gallery preview
- 📅 **Appointment Booking** - Easy-to-use appointment scheduling system
- 💼 **Services Catalog** - Browse and view detailed information about all services
- 🖼️ **Gallery** - Visual showcase of previous work and transformations
- 📞 **Contact** - Multiple ways to get in touch (WhatsApp, phone, email)
- 💬 **WhatsApp Integration** - Direct chat widget for instant customer support

### Admin Features
- 📊 **Dashboard** - Analytics and overview of business metrics
- 📅 **Appointment Management** - View, approve, cancel, and manage customer appointments
- 💼 **Service Management** - Create, update, and delete services
- 🖼️ **Gallery Management** - Upload, edit, and organize gallery images
- ⏰ **Availability Management** - Set available time slots for appointments
- 👤 **Profile Management** - Update admin profile and settings

### Technical Features
- 🌓 **Dark/Light Theme** - Seamless theme switching with persistent preferences
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🔒 **Secure Routes** - Protected admin routes with authentication guards
- 🎨 **Modern UI/UX** - TailwindCSS-based design system with custom theming

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router 4** - Official router for Vue.js
- **TailwindCSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Leaflet** - Interactive maps library
- **Lucide Vue Next** - Beautiful icon library
- **Font Awesome** - Icon toolkit

### Backend Integration
- Connects to external API server (see [Backend Integration](#backend-integration) section)
- JWT-based authentication
- RESTful API communication

## 📁 Project Structure

```
client/
├── public/                 # Static assets
│   └── images/            # Image files (logo, favicon, hero images)
├── src/
│   ├── assets/            # Static assets with processing
│   │   └── styles/        # Global styles and theme CSS
│   ├── components/        # Reusable Vue components
│   │   ├── Admin/         # Admin-specific components
│   │   ├── Modals/        # Modal components
│   │   └── ...            # Other shared components
│   ├── composables/       # Vue 3 composables (useTheme, etc.)
│   ├── layouts/           # Layout components (AdminLayout)
│   ├── routes/            # Vue Router configuration
│   ├── services/          # API service layer
│   │   ├── api.js         # Axios instance and interceptors
│   │   ├── auth.js        # Authentication services
│   │   ├── appointments.js
│   │   ├── services.js
│   │   ├── gallery.js
│   │   └── ...
│   ├── views/             # Page components
│   │   ├── Admin/         # Admin dashboard pages
│   │   ├── Home.vue       # Landing page
│   │   ├── Services.vue   # Services listing
│   │   ├── Appointments.vue
│   │   ├── Gallery.vue
│   │   └── ...
│   ├── App.vue            # Root component
│   ├── main.js            # Application entry point
│   └── style.css          # Global styles
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Backend API** - Either external API (e.g., Render) or local backend server

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd houseOfpeishy/client
   ```

2. **Install dependencies**
   ```bash
   npm install


3. **Start the development server**
   ```bash
   npm run dev          # Starts frontend on port 5173
   ```

## 📜 Available Scripts

### Frontend Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```


## 🔌 Backend Integration

The client application connects to a backend API server. The backend is located separately in the project (see `../server/` directory) or can be hosted externally.


### API Service Layer

The API service layer (`src/services/api.js`) automatically handles:
- Token authentication via Bearer tokens
- Request/response interceptors
- Error handling and 401 redirects
- Base URL configuration

All API calls are made through service modules in `src/services/`:
- `auth.js` - Authentication endpoints
- `appointments.js` - Appointment management
- `services.js` - Service catalog
- `gallery.js` - Gallery management
- `availability.js` - Availability management
- `adminDashboard.js` - Admin dashboard data

## 🌐 Deployment

### Frontend Deployment (Vercel)

The project is configured for Vercel deployment:

1. **Connect your repository** to Vercel
2. **Set build settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**

> **Note**: The backend API is deployed separately. See the backend repository/server directory for backend deployment instructions.

## 🎨 Customization

### Themes

The application supports theming via CSS variables. Edit `src/assets/styles/theme.css` to customize colors and styles.

### Styling

- **TailwindCSS** is configured in `vite.config.js`
- Custom theme colors are defined as CSS variables
- Responsive breakpoints follow Tailwind defaults

### Components

All components are located in `src/components/` and can be customized as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes

- The admin dashboard requires authentication via JWT tokens
- All API requests are handled through the service layer in `src/services/`
- The application uses localStorage for token persistence
- WhatsApp widget is automatically disabled on admin/login routes

## 🔗 Links

- **Production Site**: https://houseofpeishy.vercel.app

## 📄 License

This project is private and proprietary.

## 👤 Author

**Tino**

---

**Built with ❤️ for House of Peishy**
