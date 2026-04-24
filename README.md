<div align="center">

# 📈 StockConnect

**A premium, real-time stock trading simulation platform for education and professional market training.**

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

StockConnect is a full-stack, multi-role stock trading simulation platform built for educational institutions and professional training programs. It provides a realistic, risk-free environment where traders can place orders, manage portfolios, and react to market events — while administrators maintain full oversight of sessions, users, and platform configuration.

The platform is structured around **three distinct user roles**, each with a dedicated, role-specific dashboard:

| Role | Responsibilities |
|---|---|
| 🤵 **Super Admin** | Platform governance, user management, audit logging, and system settings |
| 🏢 **Market Admin** | Market session control, scenario injection, order book oversight, and leaderboards |
| 📊 **Trader** | Real-time order placement, portfolio management, and wallet funding |

---

## ✨ Features

### 🤵 Super Admin Portal
- **User & Role Management** — Create, update, suspend, and assign roles to all platform participants.
- **Audit Logging** — Immutable, timestamped records of every administrative action across the platform.
- **System Settings** — Live configuration of global parameters: platform name, currency, timezone, session timeout, 2FA enforcement, and notification preferences.
- **Company Management** — Register and manage the companies whose stocks are available for trading.

### 🏢 Market Administrator Dashboard
- **Session Control** — Schedule and execute market open/close cycles with configurable automated behaviors.
- **Scenario Injection** — Broadcast market-moving news and events to all active traders in real-time to simulate volatility and test trader responses.
- **Order Book Oversight** — Full, real-time audit trail of all pending and executed orders across all symbols.
- **Trader Leaderboard** — Live ranking of all participants based on portfolio performance and net worth.
- **Analytics** — Platform-wide trading statistics and session performance reports.

### 📊 Trader Experience
- **Real-time Market Data** — Browse and monitor Rwandan and global market symbols (e.g., BK, MTN Rwanda) with live price trends.
- **Order Placement** — Execute **Market** and **Limit** orders on both the **Buy** and **Sell** sides via a streamlined order form.
- **Portfolio Management** — Holistic view of all current holdings, unrealized P&L, and historical trade performance.
- **Simulated Wallet** — Secure RWF balance management supporting deposits and withdrawals for order execution.
- **Trade History** — Detailed, filterable log of every trade executed by the trader.

---

## 🏗️ Architecture

StockConnect follows a classic **decoupled client-server architecture**:

```
StockConnect/
├── Frontend /
│   └── stockconnect_frontend/       # React + Vite SPA
│       └── src/
│           ├── components/          # Reusable UI components (shared, layout)
│           ├── context/             # Global React context (Auth, etc.)
│           ├── pages/
│           │   ├── admin/           # Super Admin pages
│           │   ├── marketAdmin/     # Market Admin pages
│           │   └── trader/          # Trader pages
│           └── services/            # Axios API service layer
│               ├── apiClient.js
│               ├── authService.js
│               ├── orderService.js
│               ├── walletService.js
│               ├── portfolioService.js
│               ├── marketAdminService.js
│               ├── superAdminService.js
│               └── companyService.js
│
└── Backend/
    └── stockconnect/                # Spring Boot Application
        └── src/main/java/com/stockconnect/
            ├── config/              # Security & CORS configuration
            ├── controllers/         # REST API endpoints
            ├── dto/                 # Data Transfer Objects
            ├── exceptions/          # Global exception handling
            ├── models/              # JPA entities (User, Order, Trade, Wallet…)
            ├── repositories/        # Spring Data JPA repositories
            ├── security/            # JWT filter, UserDetailsService
            └── services/            # Core business logic
```

### Key Domain Models

| Model | Description |
|---|---|
| `User` | Platform participant with an assigned `Role` (SUPER_ADMIN, MARKET_ADMIN, TRADER) |
| `Order` | A buy/sell instruction with type (MARKET/LIMIT), side, status, and quantity |
| `Trade` | A completed execution record created when a buy and sell order are matched |
| `PortfolioHolding` | A user's aggregate position in a given stock symbol |
| `Wallet` | An RWF balance account linked to a trader, used to fund orders |
| `MarketSession` | Records of market open/close events managed by Market Admins |
| `AuditLog` | Immutable event log recording all critical administrative actions |
| `SystemSettings` | Singleton entity storing global platform configuration |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Vite** | Next-generation build tooling and dev server |
| **Tailwind CSS v4** | Utility-first styling system |
| **Lucide React** | High-clarity SVG icon library |
| **Axios** | HTTP client for REST API communication |
| **STOMP / WebSocket** | Real-time data streaming from the backend |

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Primary programming language |
| **Spring Boot 3** | Application framework |
| **Spring Security + JWT** | Authentication and stateless session management |
| **Spring Data JPA / Hibernate** | ORM and database abstraction layer |
| **Maven** | Dependency management and build lifecycle |

### Security
- **Role-Based Access Control (RBAC)** with JWT tokens
- **Vite Dev Proxy** to eliminate CORS issues during development
- **Environment-driven configuration** via `.env` files (no hardcoded URLs)

---

## 📦 Getting Started

### Prerequisites

Ensure the following tools are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [Java Development Kit (JDK)](https://openjdk.org/) 17 or higher
- [Apache Maven](https://maven.apache.org/) 3.8+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/StockConnect.git
cd StockConnect
```

---

### 2. Backend Setup

```bash
cd "Backend/stockconnect"
```

Configure your database connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/stockconnect
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
```

Start the Spring Boot server:

```bash
mvn spring-boot:run
```

The API will be available at **`http://localhost:8080`**.

---

### 3. Frontend Setup

```bash
cd "Frontend /stockconnect_frontend"
```

Create a `.env` file in the frontend root with the following variables:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application will be available at **`http://localhost:5173`**.

> **Note:** The Vite dev server is configured to proxy all `/api` and `/ws` requests to the backend automatically, so no CORS configuration is needed in development.

---

## 👤 User Roles & Access

| Role | Default Access |
|---|---|
| `SUPER_ADMIN` | Full platform control — users, settings, audit logs, companies |
| `MARKET_ADMIN` | Session management, scenario injection, order book, leaderboard |
| `TRADER` | Order placement, portfolio, wallet, trade history |

> Roles are seeded into the database on first startup via the application's `DataSeeder` component.

---

## 📡 API Overview

The backend exposes a RESTful API under the `/api` prefix. Key endpoint groups:

| Controller | Base Path | Description |
|---|---|---|
| `AuthController` | `/api/auth` | Login and token issuance |
| `UserController` | `/api/users` | User profile management |
| `OrderController` | `/api/orders` | Order placement and status |
| `TradeController` | `/api/trades` | Executed trade history |
| `WalletController` | `/api/wallet` | Balance, deposits, withdrawals |
| `PortfolioController` | `/api/portfolio` | Holdings and net worth |
| `MarketAdminController` | `/api/market-admin` | Sessions, scenarios, leaderboard |
| `SuperAdminController` | `/api/super-admin` | Users, audit logs, system settings |

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

<div align="center">
  Built with ❤️ by the <strong>StockConnect Team</strong>
</div>
