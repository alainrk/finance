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

interface PaymentData {
  month: number;
  interest: number;
  principal: number;
  extraPayment: number;
  balance: number;
}

const MortgageCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(3);
  const [years, setYears] = useState<number>(30);
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);
  const [reduceInstallments, setReduceInstallments] = useState<boolean>(true);
  const [mortgageData, setMortgageData] = useState<PaymentData[]>([]);

  useEffect(() => {
    calculateMortgage();
  }, [amount, interestRate, years, additionalPayment, reduceInstallments]);

  const calculateMortgage = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = amount;
    const data: PaymentData[] = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;

      let extraPayment = 0;
      if (month % 12 === 0) {
        extraPayment = additionalPayment;
      }

      balance -= principal + extraPayment;

      if (balance < 0) balance = 0;

      data.push({
        month,
        interest: interest,
        principal: principal,
        extraPayment: extraPayment,
        balance: balance,
      });

      if (balance === 0) break;
    }

    setMortgageData(data);
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
              value={additionalPayment}
              onChange={(e) => setAdditionalPayment(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={reduceInstallments}
              onChange={(e) => setReduceInstallments(e.target.checked)}
              className="mr-2"
            />
            Reduce Installments (vs. Reduce Term)
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Totals</h2>
          <p>
            Total Payments:{" "}
            {mortgageData
              .reduce(
                (sum, payment) =>
                  sum +
                  payment.interest +
                  payment.principal +
                  payment.extraPayment,
                0,
              )
              .toFixed(2)}
          </p>
          <p>
            Total Interest:{" "}
            {mortgageData
              .reduce((sum, payment) => sum + payment.interest, 0)
              .toFixed(2)}
          </p>
          <p>Total Principal: {amount}</p>
          <p>
            Total Extra Payments:{" "}
            {mortgageData
              .reduce((sum, payment) => sum + payment.extraPayment, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Payment Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mortgageData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="interest" stackId="a" fill="#8884d8" />
            <Bar dataKey="principal" stackId="a" fill="#82ca9d" />
            <Bar dataKey="extraPayment" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
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
                <th className="px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {mortgageData.map((payment, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-4 py-2">{payment.month}</td>
                  <td className="px-4 py-2">{payment.interest.toFixed(2)}</td>
                  <td className="px-4 py-2">{payment.principal.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {payment.extraPayment.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{payment.balance.toFixed(2)}</td>
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
