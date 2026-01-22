import Header from "../components/Header";
import Sidebar from "../layout/Sidebar";
import { useParams } from "react-router-dom";
import { useState } from "react";

// ✅ Import frontend JSON (ARRAY)
import policies from "../data/user-policies.json";

const PolicyDetails = () => {
  const { id } = useParams();

  // ✅ Find policy from JSON
  const policy = policies.find((p) => p.id === Number(id));

  const [purchased, setPurchased] = useState(false);

  if (!policy) {
    return <p className="p-8 text-red-600">Policy not found</p>;
  }

  // 🔹 Premium calculation (JSON-friendly)
  const calculatePremium = () => {
    const coverageValue = Number(policy.coverage_amount) || 0;

    let premium = coverageValue * 0.01;

    if (policy.policy_type.includes("Health")) premium += 500;
    if (policy.policy_type.includes("Travel")) premium += 300;
    if (policy.policy_type.includes("Accident")) premium += 200;

    if (policy.payment_frequency === "Monthly") premium /= 12;

    return Math.round(premium);
  };

  // 🔹 Buy plan (demo)
  const handleBuyPlan = () => {
    setPurchased(true);
    alert("✅ Policy purchased successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1">
        <Header />

        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-2">Policy Details</h1>
          <p className="text-gray-500 mb-6">Home / Policies / Policy Details</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Top */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold">{policy.title}</h2>

              <p className="mt-2 text-gray-700">Policy Number</p>
              <p className="font-medium">{policy.policy_number}</p>

              <span className="inline-block mt-3 bg-blue-600 text-white text-sm px-4 py-1 rounded-full">
                ACTIVE
              </span>

              <p className="mt-4 text-gray-700">
                Payment Frequency: <b>{policy.payment_frequency}</b>
              </p>
            </div>

            {/* Right Top */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">
                Detailed Policy Information
              </h2>

              <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                <span>Policy Type</span>
                <span>{policy.policy_type}</span>

                <span>Coverage Amount</span>
                <span>₹ {policy.coverage_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Left Bottom */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">
                Coverage & Benefits
              </h2>

              <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                <span>Hospital Cover</span>
                <span>₹ {policy.coverage_amount.toLocaleString()}</span>

                <span>Accidental Cover</span>
                <span>Included</span>

                <span>Critical Illness</span>
                <span>Included</span>
              </div>

              <hr className="my-4" />

              <div>
                <div className="flex justify-between font-semibold">
                  <span>Estimated Premium</span>
                  <span>₹ {calculatePremium()}</span>
                </div>

                {!purchased ? (
                  <button
                    onClick={handleBuyPlan}
                    className="mt-2 inline-block bg-blue-600 text-white text-sm px-4 py-1 rounded-full hover:bg-blue-700 transition"
                  >
                    Activate Plan
                  </button>
                ) : (
                  <span className="mt-2 inline-block bg-green-600 text-white text-sm px-4 py-1 rounded-full">
                    PURCHASED
                  </span>
                )}
              </div>
            </div>

            {/* Right Bottom */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>

              <ul className="space-y-3 text-blue-600 font-medium">
                <li>📄 Policy Document PDF</li>
                <li>📄 Terms & Conditions</li>
                <li>📄 Claim Form</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
