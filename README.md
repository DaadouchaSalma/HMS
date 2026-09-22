# HMS (Hospital Management System)

HMS is a full-stack hospital management platform designed to centralize the daily activities of patients, doctors, pharmacists, administrative staff, and hospital administrators.

The application combines a role-based web interface with a REST API and real-time communication services to support medical, administrative, pharmacy, billing, and appointment workflows.

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Real-Time Services](#real-time-services)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Security Notes](#security-notes)

## Project Overview

HMS consists of two applications:

1. **Backend**: An ASP.NET Core 9 Web API that manages business logic, authentication, authorization, persistence, payments, document generation, and real-time services.
2. **Frontend**: An Angular 19 application using CoreUI that provides dashboards and role-based workflows for hospital users.

## Main Features

- **Authentication and authorization** with ASP.NET Core Identity and role-based access.
- **Patient management**, including patient profiles and medical information.
- **Doctor and staff management** for medical and administrative personnel.
- **Appointments** and appointment lifecycle management.
- **Admissions and room management** for hospital stays.
- **Medical records** and dossier management.
- **Prescriptions and pharmacy inventory** management.
- **Shopping cart and medication ordering** workflows.
- **Invoices and online payments** through Stripe.
- **PDF generation** for invoices and medical documents.
- **Complaints and requests** management.
- **Notifications and messaging** using SignalR.
- **Medical chatbot** integration.
- **Dashboards** tailored to administrators, doctors, pharmacists, patients, and visitors.

## Project Structure

```text
HMS/
├── backend/
│   └── HMS/
│       ├── Controllers/       # REST API controllers
│       ├── Data/              # Entity Framework database context
│       ├── Hubs/              # SignalR hubs
│       ├── Interfaces/        # Repository and service contracts
│       ├── Models/            # Domain and DTO models
│       ├── Repositories/      # Data access implementations
│       ├── Services/          # Application services and background jobs
│       ├── HMS.csproj
│       └── Program.cs
└── frontend/
    ├── src/app/components/    # Feature components
    ├── src/app/services/      # API and SignalR services
    ├── src/app/models/        # TypeScript models
    ├── angular.json
    └── package.json
```

## Prerequisites

Install the following tools before starting the project:

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) 18.19.1+, 20.11.1+, or 22+
- npm 9+
- SQL Server or SQL Server LocalDB
- A configured Stripe account
- A configured SMTP account

## Backend Setup

1. Open a terminal at the repository root and move to the backend project:

   ```bash
   cd backend/HMS
   ```

2. Configure the database connection and external services. For local development, use .NET user secrets instead of committing credentials:

   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\mssqllocaldb;Database=HmsDb;Trusted_Connection=True;TrustServerCertificate=True"
   dotnet user-secrets set "Stripe:SecretKey" "your-stripe-test-secret-key"
   dotnet user-secrets set "GeminiApiKey" "your-gemini-api-key"
   ```

   Configure SMTP credentials using the same approach or environment variables.

3. Restore dependencies and build the project:

   ```bash
   dotnet restore
   dotnet build
   ```

4. Start the API:

   ```bash
   dotnet run
   ```

   The API is available at:

   - HTTP: `http://localhost:5160`

## Frontend Setup

1. Open a second terminal and move to the frontend application:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the Angular development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:4200](http://localhost:4200) in a browser.

The frontend services currently use `http://localhost:5160` as the backend API URL. Start the backend before using authenticated or data-driven pages.

## Real-Time Services

The backend exposes the following SignalR hubs:

- Notifications: `http://localhost:5160/notificationHub`
- Messaging: `http://localhost:5160/message`

The frontend connects to these hubs for live notifications and user messaging.

## Technologies Used

### Backend

- C# and .NET 9
- ASP.NET Core Web API
- Entity Framework Core 9
- SQL Server / SQL Server LocalDB
- ASP.NET Core Identity
- SignalR
- Stripe.NET
- iText 7 and PDFsharp/MigraDoc
- OpenAPI

### Frontend

- Angular 19
- TypeScript
- CoreUI for Angular
- Bootstrap
- Angular Material
- RxJS
- Chart.js
- FullCalendar
- Microsoft SignalR client
- Stripe.js

## Contributing

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make and test your changes.
4. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

5. Push the branch and open a pull request.

## Security Notes

- Never commit API keys, Stripe secret keys, SMTP passwords, or other credentials.
- Rotate any credentials that may already have been committed to the repository.
- Use .NET user secrets for local development and environment variables or a managed secret store in production.
- Use HTTPS and secure cookie settings when deploying outside local development.