import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface Params {
  initialInvestment: number;
  houseValue: number;
  monthlySavings: number;
  investmentReturn: number;
  houseAppreciation: number;
  mortgageRate: number;
  mortgageYears: number;
  monthlyRent: number;
  rentIncrease: number;
  propertyTaxRate: number;
  homeInsurance: number;
  maintenanceRate: number;
  downPaymentPercentage: number;
}

interface Projection {
  year: number;
  scenario1: number;
  scenario2: number;
  scenario3: number;
  houseValue: number;
}

interface TableProps {
  projections: Array<{
    year: number;
    scenario1: number;
    scenario2: number;
    scenario3: number;
    houseValue: number;
  }>;
  params: {
    downPaymentPercentage: number;
    houseValue: number;
  };
  formatEUR: (value: number, decimals?: number) => string;
}

const formatEUR = (num: number, decimals = 2): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatAxisLabel = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K €`;
  } else {
    return `${value.toFixed(0)} €`;
  }
};

const calculateCompoundInterest = (
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): number => {
  let total = principal;
  const monthlyRate = annualRate / 12 / 100;
  for (let i = 0; i < years * 12; i++) {
    total = total * (1 + monthlyRate); // Calculate interest first
    total += monthlyContribution; // then add monthly contribution
  }
  return total;
};

const calculateMortgage = (
  principal: number,
  annualRate: number,
  years: number,
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const numPayments = years * 12;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
};

const paramLabels: { [key in keyof Params]: string } = {
  initialInvestment: "Initial Investments",
  houseValue: "House Value",
  monthlySavings: "Monthly Savings",
  investmentReturn: "Investments Return (year %)",
  houseAppreciation: "House Appreciation (year %)",
  mortgageRate: "Mortgage Rate (fixed %)",
  mortgageYears: "Mortgage Years",
  monthlyRent: "Monthly Rent",
  rentIncrease: "Rent Increase (year %)",
  propertyTaxRate: "Property Tax Rate (%)",
  homeInsurance: "Home Insurance (Annual)",
  maintenanceRate: "Maintenance Rate (year %)",
  downPaymentPercentage: "House Down Payment (%)",
};

const NetWorthProjectionComponent: React.FC = () => {
  const [params, setParams] = useState<Params>({
    initialInvestment: 300000,
    houseValue: 200000,
    monthlySavings: 2500,
    investmentReturn: 5,
    houseAppreciation: 0.5,
    mortgageRate: 2.7,
    mortgageYears: 30,
    monthlyRent: 750,
    rentIncrease: 0.5,
    propertyTaxRate: 0,
    homeInsurance: 1000,
    maintenanceRate: 1,
    downPaymentPercentage: 20,
  });

  const [steps] = useState<Params>({
    initialInvestment: 5000,
    houseValue: 5000,
    monthlySavings: 500,
    investmentReturn: 0.5,
    houseAppreciation: 0.25,
    mortgageRate: 0.1,
    mortgageYears: 5,
    monthlyRent: 50,
    rentIncrease: 0.25,
    propertyTaxRate: 0.1,
    homeInsurance: 50,
    maintenanceRate: 0.25,
    downPaymentPercentage: 5,
  });

  const [projections, setProjections] = useState<Projection[]>([]);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  useEffect(() => {
    calculateProjections();
  }, [params]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 border border-gray-300 rounded shadow">
          <p className="label font-medium">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatEUR(entry.value as number)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateMortgageBalance = (
    principal: number,
    annualRate: number,
    years: number,
    currentYear: number,
  ): number => {
    const monthlyRate = annualRate / 12 / 100;
    const monthlyPayment = calculateMortgage(principal, annualRate, years);

    const remainingPayments = (years - currentYear) * 12;
    if (remainingPayments <= 0) return 0;

    return (
      (monthlyPayment / monthlyRate) *
      (1 - Math.pow(1 + monthlyRate, -remainingPayments))
    );
  };

  const calculateProjections = () => {
    const years = Array.from(
      { length: Math.ceil(params.mortgageYears / 5) + 1 },
      (_, i) => 5 * i,
    );

    const newProjections: Projection[] = years.map((year) => {
      // Scenario 1: Buying entire house
      const monthlyExpensesScenario1 =
        (params.houseValue * params.propertyTaxRate) / 100 / 12 +
        params.homeInsurance / 12 +
        (params.houseValue * params.maintenanceRate) / 100 / 12;

      const investmentScenario1 = calculateCompoundInterest(
        params.initialInvestment - params.houseValue,
        params.monthlySavings - monthlyExpensesScenario1,
        params.investmentReturn,
        year,
      );
      const houseValue =
        params.houseValue * Math.pow(1 + params.houseAppreciation / 100, year);

      // Scenario 2: Buying with mortgage
      const downPayment =
        (params.houseValue * params.downPaymentPercentage) / 100;
      const mortgageAmount = Math.max(0, params.houseValue - downPayment);

      let monthlyMortgage = 0;
      if (mortgageAmount > 0) {
        monthlyMortgage = calculateMortgage(
          mortgageAmount,
          params.mortgageRate,
          params.mortgageYears,
        );
      }

      const monthlyExpenses =
        monthlyMortgage +
        (params.houseValue * params.propertyTaxRate) / 100 / 12 +
        params.homeInsurance / 12 +
        (params.houseValue * params.maintenanceRate) / 100 / 12;

      const investmentScenario2 = calculateCompoundInterest(
        params.initialInvestment - downPayment,
        params.monthlySavings - monthlyExpenses,
        params.investmentReturn,
        year,
      );

      const mortgageBalance = calculateMortgageBalance(
        mortgageAmount,
        params.mortgageRate,
        params.mortgageYears,
        year,
      );

      console.log(
        `[Scenario 2] Monthly mortgage at year ${year}: ${formatEUR(monthlyMortgage)}`,
      );
      console.log(
        `[Scenario 2] Mortgage Balance at year ${year}: ${formatEUR(mortgageBalance)}`,
      );

      // Scenario 3: Keep renting and keep all invested
      const monthlyRentYear =
        params.monthlyRent * Math.pow(1 + params.rentIncrease / 100, year);

      const investmentScenario3 = calculateCompoundInterest(
        params.initialInvestment,
        params.monthlySavings - monthlyRentYear,
        params.investmentReturn,
        year,
      );

      return {
        year,
        scenario1: investmentScenario1 + houseValue,
        scenario2: investmentScenario2 + houseValue - mortgageBalance,
        scenario3: investmentScenario3,
        houseValue,
      };
    });

    setProjections(newProjections);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(params) as Array<keyof Params>).map((key) => (
              <div key={key} className="relative">
                <label className="block mb-2">
                  {paramLabels[key]}:
                  <input
                    type="number"
                    step={steps[key]}
                    name={key}
                    value={params[key]}
                    onChange={handleParamChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2 className="my-2 text-xl font-semibold mb-2">Projection Details</h2>
        <ProjectionTable
          projections={projections}
          params={params}
          formatEUR={formatEUR}
        />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">
          Net Worth Projection Chart
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={projections}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#666" strokeWidth={2} />
            <YAxis
              tickFormatter={formatAxisLabel}
              stroke="#666"
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="scenario1"
              name="Buy Cash"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="scenario2"
              name="Mortgage"
              stroke="#82ca9d"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="scenario3"
              name="Rent"
              stroke="#ffc658"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ProjectionTable: React.FC<TableProps> = ({
  projections,
  params,
  formatEUR,
}) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left ">
        <thead className="text-xs uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Year
            </th>
            <th scope="col" className="px-6 py-3">
              Buying Cash
            </th>
            <th scope="col" className="px-6 py-3">
              Buying (Down Pay:{" "}
              {formatEUR(
                (params.downPaymentPercentage * params.houseValue) / 100,
              )}
              )
            </th>
            <th scope="col" className="px-6 py-3">
              Keep Renting
            </th>
            <th scope="col" className="px-6 py-3">
              House Value
            </th>
          </tr>
        </thead>
        <tbody>
          {projections.map((projection, index) => (
            <tr key={index} className="">
              <th scope="row" className="px-6 py-4 font-medium ">
                {projection.year}
              </th>
              <td className="px-6 py-4">
                {formatEUR(projection.scenario1, 0)}
              </td>
              <td className="px-6 py-4">
                {formatEUR(projection.scenario2, 0)}
              </td>
              <td className="px-6 py-4">
                {formatEUR(projection.scenario3, 0)}
              </td>
              <td className="px-6 py-4">
                {formatEUR(projection.houseValue, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NetWorthProjectionComponent;
