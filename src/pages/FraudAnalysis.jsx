import React, { useState } from "react";
import Header from "../layout/Navbar";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import claimsData from "../data/claim_report.json";
import { calculateFraudWithRules } from "../utils/fraudEngine";

const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

const RULES = [
  { id: "FRD-001", label: "High Claim Amount" },
  { id: "FRD-002", label: "Early Policy Claim" },
  { id: "FRD-003", label: "Multiple Claims" },
  { id: "FRD-004", label: "Document Issues" },
  { id: "FRD-005", label: "Shared Bank Account" },
];

const FraudAnalytics = () => {
  const [selectedRules, setSelectedRules] = useState([]);
  const [result, setResult] = useState(null);

  // ➕ Add rule
  const addRule = (ruleId) => {
    const rule = RULES.find((r) => r.id === ruleId);
    if (rule && !selectedRules.some((r) => r.id === ruleId)) {
      setSelectedRules([...selectedRules, rule]);
    }
  };

  // ❌ Remove rule
  const removeRule = (ruleId) => {
    setSelectedRules(selectedRules.filter((r) => r.id !== ruleId));
  };

  // ▶️ Run analysis (frontend version of POST /fraud/analyze)
  const runAnalytics = () => {
    const riskCount = { Low: 0, Medium: 0, High: 0 };

    const analyzedClaims = claimsData.map((claim) => {
      const fraud = calculateFraudWithRules(
        claim,
        selectedRules.map((r) => r.id),
      );

      riskCount[fraud.risk] += 1;

      return {
        id: claim.id,
        name: claim.name,
        fraud_score: fraud.fraud_score,
        risk: fraud.risk,
        triggered_rules: fraud.triggered_rules,
      };
    });

    setResult({
      claims: analyzedClaims,
      risk_distribution: riskCount,
    });
  };

  const pieData = result
    ? [
        { name: "High", value: result.risk_distribution.High },
        { name: "Medium", value: result.risk_distribution.Medium },
        { name: "Low", value: result.risk_distribution.Low },
      ]
    : [];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-blue-500 text-white p-4">
        <div className="mb-4 font-semibold">Insurance CRC</div>
        <Link to="/AdminDashboard">
          <div className="px-3 py-2 rounded-lg opacity-90 hover:bg-white/20 cursor-pointer">
            Dashboard
          </div>
        </Link>
        <Link to="/Frauddetection" className="block py-2">
          Fraud Detection
        </Link>
      </aside>

      {/* Main */}
      <div className="flex-1 bg-gray-100">
        <Header />

        <main className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Fraud Risk Analytics</h2>

          {/* 🔽 Rule Selector */}
          <div className="bg-white p-5 rounded-xl shadow space-y-4">
            <select
              className="w-full border rounded p-2"
              onChange={(e) => {
                addRule(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">Select a rule</option>
              {RULES.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.id} - {rule.label}
                </option>
              ))}
            </select>

            {/* Selected rules */}
            <div className="flex flex-wrap gap-2">
              {selectedRules.map((rule, index) => (
                <span
                  key={rule.id}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {index + 1}. {rule.label}
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="ml-2 text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ▶️ Run */}
          <button
            onClick={runAnalytics}
            disabled={selectedRules.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Run Analysis
          </button>

          {/* 📊 Results */}
          {result && (
            <>
              <div className="grid grid-cols-3 gap-6">
                {result.claims.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded shadow">
                    <p className="font-semibold">Claim ID: {c.id}</p>
                    <p>Policy Holder: {c.name}</p>
                    <p className="font-semibold">
                      Fraud Score: {c.fraud_score}
                    </p>
                    <p>Risk: {c.risk}</p>

                    <ul className="list-disc ml-5 text-sm text-gray-600 mt-2">
                      {c.triggered_rules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow h-64">
                <h3 className="font-semibold mb-4">Claims Risk Distribution</h3>

                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FraudAnalytics;
