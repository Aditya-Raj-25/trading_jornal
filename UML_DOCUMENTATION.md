# Trading Journal UML Documentation

This document contains Mermaid diagrams visualizing the architecture and workflow of the Trading Journal backend, emphasizing the OOP design patterns (Strategy, Factory, Facade) implemented.

## 1. UML Class Diagram
Illustrates the core structural relationships between Domain objects, Repositories, Services, Factories, and Facades.

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +String password
    }

    class Trade {
        +Date date
        +String asset
        +String direction
        +Number entry
        +Number sl
        +Number tp
        +Number profit
    }

    class ITradeRepository {
        <<Interface>>
        +create(trade)
        +find(query)
    }

    class TradeRepository {
        +create(trade)
        +find(query)
    }

    class TradingStrategy {
        <<Abstract>>
        +String name
        +validateTrade(trade)
        +calculateRisk(entry, sl)
    }

    class ScalpingStrategy {
        +validateTrade(trade)
    }

    class SwingStrategy {
        +validateTrade(trade)
    }

    class StrategyFactory {
        +createStrategy(type) TradingStrategy
    }

    class ReportFactory {
        +createReportGenerator(format)
    }

    class AnalyticsFacade {
        +getFullAnalyticsReport(userId, format)
    }

    class AnalyticsService {
        +getSummary(userId)
    }

    class ReportService {
        +generatePdfReport(userId, period)
    }

    ITradeRepository <|.. TradeRepository
    TradingStrategy <|-- ScalpingStrategy
    TradingStrategy <|-- SwingStrategy
    StrategyFactory ..> TradingStrategy : Creates
    AnalyticsFacade o-- AnalyticsService : Aggregates
    AnalyticsFacade o-- ReportFactory : Aggregates
```

## 2. UML Use Case Diagram
Visualizes the actors and their interactions with the system.

```mermaid
usecaseDiagram
    actor Trader
    
    package "Trading Journal System" {
        usecase "Login / Register" as UC1
        usecase "Log a Trade" as UC2
        usecase "View Trade History" as UC3
        usecase "View Analytics Summary" as UC4
        usecase "Generate Full Report (PDF/CSV)" as UC5
        usecase "Validate Strategy" as UC6
    }
    
    Trader --> UC1
    Trader --> UC2
    Trader --> UC3
    Trader --> UC4
    Trader --> UC5
    UC2 .> UC6 : <<includes>>
```

## 3. UML Sequence Diagram
Visualizes the flow of generating a full analytics report via the Facade pattern.

```mermaid
sequenceDiagram
    actor Client
    participant Controller as AnalyticsController
    participant Facade as AnalyticsFacade
    participant AService as AnalyticsService
    participant RFactory as ReportFactory
    participant Generator as PdfReportGenerator

    Client->>Controller: GET /api/analytics/report?format=PDF
    Controller->>Facade: getFullAnalyticsReport(userId, 'PDF')
    
    Facade->>AService: getSummary(userId)
    AService-->>Facade: summaryData
    
    Facade->>AService: getInsights(userId)
    AService-->>Facade: insightsData
    
    Facade->>RFactory: createReportGenerator('PDF')
    RFactory-->>Facade: generatorInstance (PdfReportGenerator)
    
    Facade->>Generator: generate({ summary, insights })
    Generator-->>Facade: reportBuffer
    
    Facade-->>Controller: { metadata, reportFile }
    Controller-->>Client: JSON Response (Metadata + File info)
```

## 4. UML Activity Diagram
Visualizes the process of validating a trade against a specific strategy before saving.

```mermaid
stateDiagram-v2
    [*] --> ReceiveTradeData
    ReceiveTradeData --> ExtractStrategyType
    ExtractStrategyType --> StrategyFactory
    
    state StrategyFactory {
        Choice: Valid Type?
        Choice --> InstantiateScalping : Type = 'SCALPING'
        Choice --> InstantiateSwing : Type = 'SWING'
        Choice --> ThrowError : Invalid Type
    }
    
    InstantiateScalping --> ValidateTrade
    InstantiateSwing --> ValidateTrade
    
    ValidateTrade --> CheckValid
    CheckValid --> SaveToRepository : Valid == true
    CheckValid --> RejectTrade : Valid == false
    
    SaveToRepository --> [*]
    RejectTrade --> [*]
    ThrowError --> [*]
```

## 5. ER Diagram
Visualizes the database entities and their relationships.

```mermaid
erDiagram
    USER ||--o{ TRADE : logs
    USER {
        ObjectId _id PK
        string username
        string email
        string password
        date createdAt
    }
    
    TRADE {
        ObjectId _id PK
        ObjectId userId FK
        date date
        string asset
        string direction
        number entry
        number sl
        number tp
        number lotSize
        number riskPercent
        number profit
        number disciplineScore
    }
    
    STRATEGY {
        ObjectId _id PK
        string name
        string type
    }
```
