import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ToggleSwitch from "./ToggleSwitch";

interface PaymentData {
  month: number;
  monthName: string;
  interest: number;
  principal: number;
  extraPayment: number;
  balance: number;
  totalPayment: number;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const MortgageCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(3);
  const [years, setYears] = useState<number>(30);
  const [additionalPayment, setAdditionalPayment] = useState<number>(1000);
  const [reduceInstallments, setReduceInstallments] = useState<boolean>(true);
  const [showYearlySums, setShowYearlySums] = useState<boolean>(true);
  const [mortgageData, setMortgageData] = useState<PaymentData[]>([]);

  const formatAxisLabel = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(0);
    }
  };

  useEffect(() => {
    calculateMortgage();
  }, [amount, interestRate, years, additionalPayment, reduceInstallments]);

  const calculateMortgage = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;
    let monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = amount;
    const data: PaymentData[] = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      let principal = monthlyPayment - interest;

      let extraPayment = 0;
      if (month % 12 === 0) {
        extraPayment = additionalPayment;
      }

      if (reduceInstallments && month > 12 && additionalPayment > 0) {
        // Recalculate monthly payment
        const remainingMonths = numberOfPayments - month + 1;
        monthlyPayment =
          (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        principal = monthlyPayment - interest;
      }

      balance -= principal + extraPayment;

      if (balance < 0) balance = 0;

      data.push({
        month,
        monthName: monthNames[(month - 1) % 12],
        interest: interest,
        principal: principal,
        extraPayment: extraPayment,
        balance: balance,
        totalPayment: principal + interest + extraPayment,
      });

      if (balance === 0) break;
    }

    setMortgageData(data);
  };

  const getChartData = () => {
    if (!showYearlySums) return mortgageData;

    const yearlyData: PaymentData[] = [];
    for (let i = 0; i < mortgageData.length; i += 12) {
      const yearData = mortgageData.slice(i, i + 12);
      const yearSum: PaymentData = {
        month: yearData[0].month,
        monthName: `Year ${Math.floor(yearData[0].month / 12) + 1}`,
        interest: yearData.reduce((sum, payment) => sum + payment.interest, 0),
        principal: yearData.reduce(
          (sum, payment) => sum + payment.principal,
          0,
        ),
        extraPayment: yearData.reduce(
          (sum, payment) => sum + payment.extraPayment,
          0,
        ),
        balance: yearData[yearData.length - 1].balance,
        totalPayment: yearData.reduce(
          (sum, payment) => sum + payment.totalPayment,
          0,
        ),
      };
      yearlyData.push(yearSum);
    }
    return yearlyData;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mortgage Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">
            Loan Amount:
            <input
              type="number"
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            Interest Rate (%):
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            Loan Term (years):
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            Additional Annual Payment:
            <input
              type="number"
              step={1000}
              value={additionalPayment}
              onChange={(e) => setAdditionalPayment(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <div className="space-y-1">
            {additionalPayment > 0 && (
              <ToggleSwitch
                leftLabel="Reduce Term"
                rightLabel="Reduce Installments amount"
                checked={reduceInstallments}
                onChange={setReduceInstallments}
              />
            )}
            <ToggleSwitch
              leftLabel="Show monthly"
              rightLabel="Show yearly"
              checked={showYearlySums}
              onChange={setShowYearlySums}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Totals</h2>
          <p>
            Total Payments:{" "}
            {formatNumber(
              mortgageData.reduce(
                (sum, payment) => sum + payment.totalPayment,
                0,
              ),
            )}
          </p>
          <p>
            Total Interest:{" "}
            {formatNumber(
              mortgageData.reduce((sum, payment) => sum + payment.interest, 0),
            )}
          </p>
          <p>Total Principal: {formatNumber(amount)}</p>
          <p>
            Total Extra Payments:{" "}
            {formatNumber(
              mortgageData.reduce(
                (sum, payment) => sum + payment.extraPayment,
                0,
              ),
            )}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Payment Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={getChartData()}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey={showYearlySums ? "monthName" : "month"}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={showYearlySums ? 0 : "preserveStartEnd"}
            />
            <YAxis tickFormatter={formatAxisLabel} width={80} />
            <Tooltip
              formatter={(value: number) => formatNumber(value)}
              labelFormatter={(label) =>
                showYearlySums ? label : `Month ${label}`
              }
            />
            <Legend />
            <Bar
              dataKey="interest"
              stackId="a"
              fill="#8884d8"
              name="Interest"
            />
            <Bar
              dataKey="principal"
              stackId="a"
              fill="#82ca9d"
              name="Principal"
            />
            <Bar dataKey="extraPayment" fill="#ffc658" name="Extra Payment" />
          </BarChart>
        </ResponsiveContainer>{" "}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Payment Schedule</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Interest</th>
                <th className="px-4 py-2">Principal</th>
                <th className="px-4 py-2">Extra Payment</th>
                <th className="px-4 py-2">Total Payment</th>
                <th className="px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {mortgageData.map((payment, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-4 py-2">{`${payment.month} (${payment.monthName})`}</td>
                  <td className="px-4 py-2">
                    {formatNumber(payment.interest)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(payment.principal)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(payment.extraPayment)}
                  </td>
                  <td className="px-4 py-2">
                    {formatNumber(payment.totalPayment)}
                  </td>
                  <td className="px-4 py-2">{formatNumber(payment.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
