# Asset Portfolio Management

A full-stack application that allows users to manage multiple investment wallets and track assets with automatic profit/loss calculations.

## Features

- **Authentication**: Secure email/password login and registration
- **Wallet Management**: Create, edit, and delete investment wallets
- **Asset Management**: Add, edit, and remove assets (stocks, crypto) within wallets
- **Financial Calculations**: Automatic calculation of wallet balances, spent amounts, and profit/loss

## Technology Stack

- **Frontend**: Next.js 15 with React and TypeScript
- **Backend**: Next.js API routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **Containerization**: Docker

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose (for containerized setup)
- MongoDB (or use the provided Docker setup)

## Setup Instructions

### Option 1: Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/IamCooller/careminds-full
cd careminds-full
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Variables**

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="mongodb+srv://<username>:<password>@<host>/<database>"
AUTH_SECRET="your-auth-secret"
```

4. **Initialize the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

### Option 2: Docker Setup (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/IamCooller/careminds-full
cd careminds-full
```

2. **Create environment variables**

Create a `.env` file with:

```
DATABASE_URL="mongodb://root:example@mongodb:27017/portfolio?authSource=admin"
AUTH_SECRET="your-auth-secret"
```

3. **Start the Docker containers**

```bash
docker-compose up -d
```

This will:
- Start a MongoDB container
- Start the Next.js application
- Set up the database connection

4. **Access the application**

Open your browser and navigate to `http://localhost:3000`

## User Guide

### Authentication

- Register a new account with an email and password
- Log in with existing credentials
- All your financial data is protected behind authentication

### Wallet Management

- Create a new wallet by clicking the "Create Wallet" button
- Edit a wallet by clicking the pencil icon or the "Edit Wallet" button
- Delete a wallet by clicking the trash icon (this will also delete all assets in the wallet)

### Asset Management

- Add a new asset by clicking the "Add Asset" button
- Assets require information like type (stock/crypto), symbol, name, quantity, purchase price, and current price
- Edit or delete assets using the respective icons in the asset list
- View profit/loss calculations for each asset

### Financial Information

- Each wallet displays:
  - Current total value
  - Total spent amount
  - Profit/Loss amount and percentage
- All calculations are performed automatically based on asset data

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- GET/POST /api/auth/[...nextauth] - NextAuth.js authentication endpoints

### Wallets
- GET /api/wallets - Get all wallets for the current user
- POST /api/wallets - Create a new wallet
- PATCH /api/wallets/[walletId] - Update a wallet
- DELETE /api/wallets/[walletId] - Delete a wallet

### Assets
- GET /api/wallets/[walletId]/assets - Get all assets in a wallet
- POST /api/wallets/[walletId]/assets - Add a new asset
- PATCH /api/wallets/[walletId]/assets/[assetId] - Update an asset
- DELETE /api/wallets/[walletId]/assets/[assetId] - Delete an asset

## Docker Configuration

The project includes three Docker-related files:

1. **docker-compose.yml**: Main Docker Compose configuration for development
2. **docker-compose.replica.yml**: Configuration for replica setup
3. **Dockerfile**: Application container configuration

### MongoDB Docker Setup

The MongoDB instance is configured in the docker-compose.yml file with the following settings:

```yaml
mongodb:
  image: mongo:latest
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: example
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
```

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── (auth)/               # Authentication pages
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── (root)/               # Main application pages
│   │   └── dashboard/        # Dashboard page
│   │       ├── _components/  # Dashboard components
│   │       │   ├── modals/   # Modal components
│   │       │   ├── sections/ # Page sections
│   │       │   └── ui/       # UI components
│   ├── api/                  # API routes
│   │   ├── auth/             # Auth API
│   │   ├── register/         # Registration API
│   │   ├── session/          # Session API
│   │   └── wallets/          # Wallet and asset APIs
├── components/               # Shared components
│   └── ui/                   # UI components
├── lib/                      # Utility functions
│   ├── calculations.ts       # Financial calculations
│   ├── prisma.ts             # Prisma client
│   └── utils.ts              # Helper functions
├── styles/                   # Global styles
├── types/                    # TypeScript types
├── auth.config.ts            # NextAuth configuration
├── auth.ts                   # Authentication setup
└── middleware.ts             # Next.js middleware
```

## Deployment

For production deployment:

1. Build the Docker image:
```bash
docker build -t portfolio-app .
```

2. Push to your container registry or deploy using Docker Compose
```bash
docker-compose -f docker-compose.yml up -d
```

## License

MIT

## Project Structure

The project follows a modular and scalable architecture with clear separation of concerns. Here's a detailed breakdown of the directory structure:

```
src/
├── app/                    # Next.js app directory (pages and layouts)
│   └── [page]/
│       ├── _components/    # Page-specific components
│       │   ├── sections/   # Unique sections for this page
│       │   ├── ui/        # UI elements specific to page sections
│       ├── _images/   # Page-specific images
│       └── page.tsx       # Page component
├── components/            # Shared components
│   ├── ui/               # Global UI components and shadcn components
│   └── sections/         # Reusable sections across multiple pages
├── data/                 # Test data and mock content
├── lib/                  # Utility functions and helper files
├── services/            # Server actions and data fetching
│   └── [feature]/       # Feature-specific server actions
├── styles/              # Global styles and fonts
└── types/               # TypeScript type definitions
```

## Architecture Overview

### Component Organization

The project implements a sophisticated component organization strategy:

1. **Page-Specific Components** (`_components/`)
   - Located within each page directory
   - Contains unique sections and UI elements specific to that page
   - Follows the pattern: `app/[page]/_components/`

2. **Shared Components** (`components/`)
   - **Global UI Components** (`components/ui/`)
     - Contains reusable UI components used across the entire application
     - Includes shadcn/ui components and custom UI elements
     - Provides consistent UI patterns and design system implementation
   - **Shared Sections** (`components/sections/`)
     - Reusable sections across multiple pages
     - Particularly useful for common sections like headers, footers, or shared UI patterns

### Data Management

- **Test Data** (`data/`)
  - Contains mock data and test content
  - Organized by feature or domain
  - Used for development and testing purposes

- **Services** (`services/`)
  - Implements server-side logic using Next.js server actions
  - Handles data fetching and mutations
  - Organized by feature domain

### Type Safety

- **Types** (`types/`)
  - Centralized TypeScript type definitions
  - Ensures type safety across the application
  - Includes interfaces, types, and enums

### Styling

- **Styles** (`styles/`)
  - Global styles and theme configuration
  - Font definitions and custom CSS
  - Tailwind CSS configuration and custom utilities

## Best Practices

1. **Component Isolation**
   - Page-specific components are isolated in their respective directories
   - Shared components are centralized for reusability

2. **Type Safety**
   - Comprehensive TypeScript implementation
   - Strong typing for all components and functions

3. **Server-Side Logic**
   - Clean separation of server and client-side code
   - Organized server actions in the services directory

4. **Styling**
   - Consistent use of Tailwind CSS
   - Integration with shadcn/ui for component consistency
   - Custom utilities and theme configuration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

## Contributing

Please follow the established project structure and coding conventions when contributing to this project. Ensure all new components are properly typed and documented.

