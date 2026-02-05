# 📱 React Native (Expo) – Scalable Clean Architecture Boilerplate

## ✨ Overview

This project provides a **scalable and maintainable React Native template** built using **Expo** and **Clean Architecture principles**. It is designed to separate concerns clearly, improve testability, and maintain long-term project sustainability.

---

## ⚙️ Tech Stack & Tooling

- 🚀 [Expo 52](https://expo.dev/) : Expo SDK 52 
- 🧱 Clean Architecture (Layered Approach)
- 🛡️ TypeScript for strong type safety 
- 🧹 [ESLint](https://eslint.org/) : ESLint for code quality and consistency
- 🧾 [CommitLint](https://commitlint.js.org/) : CommitLint for conventional commit messages
- 🪝 [Husky](https://typicode.github.io/husky/) : Husky for Git hooks automation
- 💉 [Inversiland](https://github.com/inversiland/inversiland) : Inversiland for dependency injection
- 🌍 [expo-localization](https://docs.expo.dev/guides/localization/) : Internationalization using  + [i18n-js](https://github.com/fnando/i18n-js)
- 🧭 [React Navigation](https://reactnavigation.org/) : React Navigation for routing
- 🧰 [MobX](https://mobx.js.org/) : MobX for state management

---

## 📁 Project File Structure

I briefly explain each of the four layers that make up clean architecture within the /src folder:

```
└── /src
    ├── AppModule.ts               # Dependency injection root module
    ├── /core                      # Core bounded context
    │   └── /presentation
    └── /post                      # Post bounded context
        ├── /domain
        ├── /application
        ├── /infrastructure
        └── /presentation
```

---

## 🏗️ Architecture Layers

### 🧠 Domain Layer

Contains business rules and core logic:

- Entities
- Specifications

> This layer is framework-independent and contains pure business logic.

---

### ⚡ Application Layer

Responsible for orchestrating domain logic and business workflows:

- Use Cases
- Application Services
- Business Flow Coordination

---

### 🔌 Infrastructure Layer

Handles implementation details and external integrations:

- API Services
- Local Storage / Database
- Repository Implementations
- Third-party Integrations

---

### 🎨 Presentation Layer

Handles UI and user interaction:

- Screens
- UI Components
- Controllers / View Models
- State Binding

---

## 🌎 Environment Configuration

Expo loads environment variables using `.env` files based on dotenv resolution.

All environment variables must use the prefix:

---

### 🧪 Development Environment

Create a `.env` file in the root directory:

```bash
EXPO_PUBLIC_API_URL=https://dummyjson.com
```

### Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
npm install
```

### Run

Android

```bash
npx expo run:android
```

### Connect with Me 🌐

Let's connect! Feel free to reach out on LinkedIn.

LinkedIn: https://www.linkedin.com/in/muhammadiqbbal/

Happy coding! 🚀✨