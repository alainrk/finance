import React, { useState } from "react";
import MortgageCalculator from "./MortgageCalculator";
import RentBuyComparison from "./RentBuyComparison";

import "./index.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mortgage" | "comparison">(
    "mortgage",
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="sticky top-0 z-10 bg-gray-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="w-8 h-8"></div>
          <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
            Financial Calculators
          </h1>
          <a
            href="https://github.com/alainrk/finance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600 transition-colors duration-200"
            aria-label="View on GitHub"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
              />
            </svg>
          </a>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-4">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-16 max-w-7xl">
          <div className="sm:hidden mb-2">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) =>
                setActiveTab(e.target.value as "mortgage" | "comparison")
              }
            >
              <option value="mortgage">Mortgage Scenarios Simulator</option>
              <option value="comparison">
                Rent vs Buy vs Mortgage Simulator
              </option>
            </select>
          </div>
          <div className="hidden sm:block mb-4">
            <nav className="flex justify-center space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("mortgage")}
                className={`${
                  activeTab === "mortgage"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                } flex-1 px-4 py-2 font-medium text-sm sm:text-base md:text-lg rounded-md transition-colors duration-150 text-center`}
              >
                Mortgage Scenarios Simulator
              </button>
              <button
                onClick={() => setActiveTab("comparison")}
                className={`${
                  activeTab === "comparison"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                } flex-1 px-4 py-2 font-medium text-sm sm:text-base md:text-lg rounded-md transition-colors duration-150 text-center`}
              >
                Rent vs Buy vs Mortgage Simulator
              </button>
            </nav>
          </div>
        </div>

        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-16 max-w-7xl">
          {activeTab === "mortgage" ? (
            <MortgageCalculator />
          ) : (
            <RentBuyComparison />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
