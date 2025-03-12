import React, { useState, useEffect } from "react";
import ToggleSwitch from "./ToggleSwitch";
import InfoTooltip from "./InfoTooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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

const formatNumber = (num: number, decimals = 2): string => {
  return num.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
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

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const totalAmount = payload.reduce(
        (sum, entry) => sum + (entry.value as number),
        0,
      );
      return (
        <div className="custom-tooltip bg-white p-4 border border-gray-300 rounded shadow">
          <p className="label font-medium">{`${showYearlySums ? "Year" : "Month"} : ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber(entry.value as number)}`}
            </p>
          ))}
          <p className="font-medium mt-2">{`Total: ${formatNumber(totalAmount)}`}</p>
        </div>
      );
    }
    return null;
  };

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
        // Calculate the remaining balance after the regular payment
        const remainingBalance = balance - principal;

        // Determine the extra payment, not exceeding the remaining balance
        extraPayment = Math.min(additionalPayment, remainingBalance);
      }

      // Adjust the principal payment if it's the last payment or if extra payment pays off the loan
      const totalPayment = principal + extraPayment;
      if (totalPayment > balance) {
        principal = balance - extraPayment;
      }

      balance -= principal + extraPayment;

      // Ensure balance doesn't go below zero
      balance = Math.max(0, balance);

      if (reduceInstallments && month > 12 && additionalPayment > 0) {
        // Recalculate monthly payment
        const remainingMonths = numberOfPayments - month + 1;
        monthlyPayment =
          (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">
            <div className="flex items-center">
              Loan Amount:
              <InfoTooltip text="The total amount of money you're borrowing from the lender to purchase your home." />
            </div>
            <input
              type="number"
              step={5000}
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            <div className="flex items-center">
              Interest Rate (%):
              <InfoTooltip text="The annual interest rate on your mortgage, expressed as a percentage. This is the cost of borrowing the principal loan amount." />
            </div>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step={0.1}
              min={0.1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            <div className="flex items-center">
              Loan Term (years):
              <InfoTooltip text="The length of time you have to repay the loan in full. Common mortgage terms are 15, 20, or 30 years." />
            </div>
            <input
              type="number"
              value={years}
              min={1}
              max={100}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            <div className="flex items-center">
              Additional Annual Payment:
              <InfoTooltip text="Extra money paid toward your mortgage principal once per year. Making additional payments can help reduce the total interest paid and shorten your loan term." />
            </div>
            <input
              type="number"
              step={1000}
              min={0}
              value={additionalPayment}
              onChange={(e) => setAdditionalPayment(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <div className="space-y-1">
            {additionalPayment > 0 && (
              <div className="flex items-center">
                <ToggleSwitch
                  leftLabel="Reduce Term"
                  rightLabel="Reduce Installments amount"
                  checked={reduceInstallments}
                  onChange={setReduceInstallments}
                />
                <InfoTooltip
                  text={`"Reduce Term" keeps your monthly payment the same but shortens the loan duration. "Reduce Installments" recalculates to lower your monthly payments while maintaining the original term.`}
                  position="right"
                />
              </div>
            )}
            <div className="flex items-center">
              <ToggleSwitch
                leftLabel="Show monthly"
                rightLabel="Show yearly"
                checked={showYearlySums}
                onChange={setShowYearlySums}
              />
              <InfoTooltip
                text="Toggle between showing monthly payment details or yearly aggregated values in the chart and table."
                position="right"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            Totals
            <InfoTooltip text="Summary of all payments over the life of the loan." />
          </h2>
          <p className="flex items-center">
            Total Payments:
            <InfoTooltip text="The sum of all payments (principal, interest, and extra payments) over the life of the loan." />
            <span className="ml-1">
              {formatNumber(
                mortgageData.reduce(
                  (sum, payment) => sum + payment.totalPayment,
                  0,
                ),
                0,
              )}
            </span>
          </p>
          <p className="flex items-center">
            Total Interest:
            <InfoTooltip text="The total amount paid in interest over the life of the loan. This is the cost of borrowing." />
            <span className="ml-1">
              {formatNumber(
                mortgageData.reduce(
                  (sum, payment) => sum + payment.interest,
                  0,
                ),
                0,
              )}
            </span>
          </p>
          <p className="flex items-center">
            Total Principal:
            <InfoTooltip text="The original loan amount that you borrowed." />
            <span className="ml-1">{formatNumber(amount)}</span>
          </p>
          <p className="flex items-center">
            Total Extra Payments:
            <InfoTooltip text="The sum of all additional payments made toward the principal throughout the loan term." />
            <span className="ml-1">
              {formatNumber(
                mortgageData.reduce(
                  (sum, payment) => sum + payment.extraPayment,
                  0,
                ),
                0,
              )}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          Payment Chart
          <InfoTooltip text="Visual representation of your mortgage payments over time, showing the breakdown between principal, interest, and extra payments." />
        </h2>
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
            <Legend />
            <Tooltip content={<CustomTooltip />} />
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
        </ResponsiveContainer>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          Payment Schedule
          <InfoTooltip text="Detailed breakdown of each payment throughout the loan term, showing how much goes to interest, principal, and your remaining balance after each payment." />
        </h2>
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extra Payment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mortgageData.map((payment, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{`${payment.month} (${payment.monthName})`}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatNumber(payment.interest)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatNumber(payment.principal)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatNumber(payment.extraPayment)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatNumber(payment.totalPayment)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatNumber(payment.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
