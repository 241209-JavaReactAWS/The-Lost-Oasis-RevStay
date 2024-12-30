# RevStay Application

## **Overview**
The RevStay Application is a secure, user-friendly platform for travelers to search for hotels, make reservations, and manage bookings. It also provides hotel owners with tools to manage their listings and reservations. The project focuses on delivering an intuitive interface and seamless functionality for both user groups.

---

## **Features**

### **User Features**
- **Account Management**:
  - User registration and login using email and password.
  - Forgot password functionality with email recovery.
- **Hotel Search**:
  - View hotel details including images, location, price, amenities, and user reviews.
  - Filter hotels by location, price range, and other criteria.
- **Booking Management**:
  - Make reservations by selecting check-in/out dates, room type, and number of guests.
  - View, modify, and cancel bookings.
  - Receive email or push notifications for booking confirmations and updates.
  - Generate invoices for completed bookings.
- **Review System**:
  - Submit reviews and ratings for hotels.
- **Favorites**:
  - Save favorite hotels for future reference.
- **Payments**:
  - Secure payment processing via integrated gateways.

### **Hotel Owner Features**
- **Account Management**:
  - Register as a seller with business details.
  - Login using email and password.
- **Hotel Management**:
  - Create and manage hotel listings with descriptions, pricing, availability, and images.
  - Respond to user reviews and feedback.
  - Monitor booking statistics and analytics.
- **Booking Management**:
  - View, accept, or reject reservations.
  - Manage room inventory and availability.

---

## **Non-Functional Requirements**
- **Scrum Process**: Development follows Agile Scrum methodology.
- **Password Security**: All passwords are encrypted using secure hashing algorithms.
- **Performance**: Fast response times for user interactions and backend operations.
- **Scalability**: Supports multiple users and hotel owners simultaneously.
- **Reliability**: Ensures accurate and consistent booking and payment processes.

---

## **Technical Details**

### **Frontend**
- **Framework**: React with Vite
- **Features**:
  - Dynamic UI for login, registration, and booking management.
  - Responsive design for mobile and desktop users.

### **Backend**
- **Framework**: Spring Boot
- **Features**:
  - RESTful APIs for user and owner authentication, hotel search, and booking management.
  - Integration with a secure payment gateway.

### **Database**
- **Type**: Relational Database (e.g., MySQL)
- **ERD Highlights**:
  - Entities: Users, Hotels, Rooms, Bookings, Payments, Reviews, Notifications.
  - Relationships: Includes one-to-many and many-to-many mappings.

---
