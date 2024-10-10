import React, { useState } from "react";
import MortgageCalculator from "./MortgageCalculator";
import RentBuyComparison from "./RentBuyComparison";

import "./index.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"mortgage" | "comparison">(
    "mortgage",
  );

  return (
    <div className="min-h-screen bg-gray-100 py-2 flex flex-col items-center sm:py-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Financial Calculators
      </h1>

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
        <div className="hidden sm:block">
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

      <div className="mt-4 w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-16 max-w-7xl">
        {activeTab === "mortgage" ? (
          <MortgageCalculator />
        ) : (
          <RentBuyComparison />
        )}
      </div>
    </div>
  );
};

export default App;
