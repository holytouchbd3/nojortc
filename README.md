# GPS Tracker Management System

This is a comprehensive web application designed to manage the entire workflow of a GPS tracker business, from sales and device shipment to installation and payment collection. The system is built for two primary user roles: **Admin** and **Technician**. The entire application is in Bengali and is designed to work directly in the browser without any build steps, storing all data in `localStorage`.

## Business Workflow

The application digitizes the following business process:
1.  **Order Creation:** The Admin receives an order and creates a new installation job in the system, assigning it to a technician.
2.  **Device Shipment:** The Admin ships the GPS tracker device to the assigned technician's location and updates the job status with courier and device details (IMEI).
3.  **Scheduling:** The technician receives the device, contacts the customer, and schedules an installation time.
4.  **Installation & Payment:** The technician installs the device in the customer's vehicle and collects the full payment.
5.  **Expense & Fund Transfer:** The technician updates the job as "Completed," submitting their travel expenses. They then transfer the collected amount to the admin after deducting their fees and approved expenses.
6.  **Final Approval:** The Admin approves the technician's travel expenses and confirms the receipt of payment, marking the job as fully complete.

---

## Features

### Admin Panel
- **Dashboard:** At-a-glance view of key metrics: Total Installs, Completed Installs, and Total Pending Amount.
- **Job Management:**
  - Create, view, and update all installation jobs.
  - Powerful filtering and searching by customer name, phone, IMEI, status, or technician.
  - Sort jobs by newest or oldest.
- **Technician Management:**
  - Add, edit, and delete technician profiles (including login credentials).
  - A technician cannot be deleted if they have an active, ongoing job.
- **Status Control:** Full control over job statuses, including shipping device details, approving travel expenses, and confirming final payments.
- **Automated Notifications:** Automatically sends WhatsApp notifications to customers at key stages of the process.

### Technician Panel
- **Personalized Dashboard:** View assigned pending jobs and the total amount of travel expenses awaiting admin approval.
- **Job List:** A clear list of all assigned jobs with detailed customer and device information.
- **Easy Communication:** Direct links to **Call**, **WhatsApp**, and **Google Maps** for seamless customer interaction.
- **Status Updates:** Technicians can update job statuses, such as scheduling an installation or marking a job as complete, which requires submitting travel expenses.
- **Notes History:** View all historical notes for a job, added by both admin and the technician.
- **Automated Notifications:** Customer receives a WhatsApp message automatically when the technician updates the job status.

---

## Technology Stack

- **Frontend:** React v19 with TypeScript
- **Styling:** Tailwind CSS
- **Data Storage:** Browser `localStorage`. The application is entirely client-side.
- **Build Process:** **None.** The app uses an `importmap` in `index.html` to load React directly from an ESM-compatible CDN (esm.sh). This makes setup extremely simple.
- **Deployment:** The project includes a `netlify.toml` file, making it ready for seamless deployment on Netlify.

---

## Getting Started

### Prerequisites
You need a modern web browser and a local web server to run this project. Using a local server is necessary to avoid potential issues with browser security policies (CORS) when making API calls.

### 1. How to Run the Project
Because there is no build step, you can run this project with any simple local web server.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Serve the project files.** Here are a few easy options:
    - **Using Python:**
      ```bash
      # For Python 3
      python -m http.server 8000
      ```
    - **Using Node.js (with the `serve` package):**
      ```bash
      # Install serve globally if you haven't already
      npm install -g serve
      # Run the server
      serve .
      ```
    - **Using VS Code:** Install the **Live Server** extension and click "Go Live" from the bottom-right status bar.

3.  Open your browser and navigate to the local address provided by your server (e.g., `http://localhost:8000`).

### 2. How to Activate WhatsApp Notifications

The application is integrated with the **Smart SMS BD** API to send automated WhatsApp messages to customers. The following API credentials are used in this project. To use the notification feature in a different environment, you can either use these credentials or replace them with your own.

1.  **Get API Credentials:**
    - If you want to use your own account, sign up at [smartsmsbd.com](http://smartsmsbd.com/) to get your **API Secret Key** and **WhatsApp Account Unique ID**.

2.  **Update the Configuration File:**
    - Open the `whatsappApi.ts` file in the project root.
    - The file is pre-configured with the following credentials. Replace them if you are using your own account.

      ```typescript
      // File: whatsappApi.ts

      // Your Smart SMS BD API Secret Key
      const API_SECRET = 'f0d00593b3756fcdafe1f9571a434e78f2b21c7a';

      // Your WhatsApp Account Unique ID
      const WHATSAPP_ACCOUNT_ID = '1766676575f899139df5e1059396431415e770c6dd694d585fe3af4';
      ```

3.  **Save the file.** After saving, the WhatsApp notification feature will be active.

> **Note on CORS:** The API calls in this project use `https://corsproxy.io/` as a temporary solution for local development to bypass CORS errors. For a production environment, it is highly recommended to set up your own backend server to securely handle API requests.

### 3. Login Credentials

-   **Admin Login:**
    -   Username: `admin`
    -   Password: `admin`

-   **Technician Login:**
    -   First, log in as an admin.
    -   Navigate to the "টেকনিশিয়ান" (Technician) tab.
    -   Create a new technician with a unique username and password.
    -   Log out and use the newly created credentials to log in as a technician.
```