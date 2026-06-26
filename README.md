# Trading Journal

A full-stack mobile trading journal application designed to help traders track their trades, reflect on their performance, and improve their discipline.

## Architecture Highlights
The backend has been meticulously refactored to implement advanced enterprise Object-Oriented Programming (OOP) patterns, ensuring high maintainability and clean architecture:
- **Service Layer & Repository Pattern:** Business logic is entirely separated from database queries and HTTP routing.
- **Strategy Pattern:** `TradingStrategy` base classes polymorphically dictate trade validation logic for different strategies (e.g., Scalping, Swing).
- **Factory Pattern:** Dynamically instantiates the correct strategies and report generation tools (`StrategyFactory`, `ReportFactory`).
- **Facade Pattern:** An `AnalyticsFacade` orchestrates data aggregation and report generation, hiding underlying complexity from the controller.
- **Singleton Pattern:** Manages a single, globally accessible MongoDB connection instance.

## Documentation
- Detailed UML diagrams (Class, Use Case, Sequence, Activity, and ER) can be found in [UML_DOCUMENTATION.md](./UML_DOCUMENTATION.md).

## Tech Stack
- **Frontend:** React Native, Expo, Tailwind CSS (Nativewind)
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with `MONGO_URI`, `PORT`, and `JWT_SECRET`.
4. Run `npm start` or `node server.js`

### Frontend
1. `cd frontend`
2. `npm install`
3. Update `frontend/services/api.js` with your local IP address.
4. Run `npx expo start`
