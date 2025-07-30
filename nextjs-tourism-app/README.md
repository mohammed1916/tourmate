# Next.js Tourism App

This is a tourism-based application built with Next.js and Redux. The app allows users to enter their source and destination, search for transportation options (buses, trains, flights), find hotels, and select tourist spots based on their budget and preferences. It also provides recommendations for plans to stay using the Gemma LLM.

## Features

- User-friendly search form for entering travel details.
- Integration with transport APIs to fetch data on buses, trains, and flights.
- Hotel search functionality using hotel-related APIs.
- Recommendations for tourist spots and activities based on user preferences and budget.
- Utilizes Redux for state management across the application.

## Project Structure

```
nextjs-tourism-app
├── src
│   ├── components
│   │   ├── SearchForm.tsx
│   │   ├── Results.tsx
│   │   └── Recommendations.tsx
│   ├── pages
│   │   ├── index.tsx
│   │   └── _app.tsx
│   ├── redux
│   │   ├── store.ts
│   │   └── slices
│   │       └── searchSlice.ts
│   ├── services
│   │   ├── transportApi.ts
│   │   ├── hotelsApi.ts
│   │   └── touristApi.ts
│   └── utils
│       └── gemmaLlm.ts
├── public
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nextjs-tourism-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the application in development mode, use the following command:

```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the app.

## APIs Used

- Transport APIs for fetching transportation options.
- Hotel APIs for retrieving hotel information.
- Tourist APIs for fetching tourist spots and activities.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.