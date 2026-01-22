import Header from "../layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ Import frontend JSON data
import fraudClaimsData from "../data/claim_report.json";

// ✅ ADD THIS (fraud calculation logic)
import { calculateFraudWithRules } from "../utils/fraudEngine";

export default function FraudDetection() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load from frontend JSON instead of backend
  useEffect(() => {
    // 🔹 CALCULATE fraud score + risk (backend equivalent)
    const analyzedClaims = fraudClaimsData.map((claim) => {
      const fraud = calculateFraudWithRules(claim);

      return {
        ...claim,
        fraud_score: fraud.fraud_score,
        risk: fraud.risk,
      };
    });

    setClaims(analyzedClaims);
    setLoading(false);
  }, []);

  const riskColor = {
    Low: "bg-blue-500",
    Medium: "bg-gray-400 text-black",
    High: "bg-red-500",
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-blue-500 text-white p-4 flex flex-col">
        <div className="w-90 h-10 bg-white text-blue-900 rounded-xl flex items-center justify-center mb-6 text-lg">
          Insurance CRC
        </div>

        <div className="space-y-2 text-sm">
          <Link to="/AdminDashboard">
            <div className="px-3 py-2 rounded-lg opacity-90 hover:bg-white/20 cursor-pointer">
              Dashboard
            </div>
          </Link>
          <div className="px-3 py-2 rounded-lg bg-white/20 cursor-pointer">
            Claims Management
          </div>
          <Link to="/Frauddetection">
            <div className="px-3 py-2 rounded-lg opacity-90 hover:bg-white/20 cursor-pointer">
              Fraud Detection
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-100">
        <Header />

        <div className="p-6">
          {/* Title + Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">FRAUD DETECTION</h2>
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg"
              onClick={() => navigate("/fraud-analysis")}
            >
              RUN ANALYSIS
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading claims...</p>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Claim ID</th>
                    <th className="px-6 py-3 text-left">Claimant</th>
                    <th className="px-6 py-3 text-left">Claim Date</th>
                    <th className="px-6 py-3 text-left">Claim Amount</th>
                    <th className="px-6 py-3 text-center">Fraud Score</th>
                    <th className="px-6 py-3 text-center">Risk</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{claim.id}</td>
                      <td className="px-6 py-4">{claim.name}</td>
                      <td className="px-6 py-4">{claim.claim_date}</td>
                      <td className="px-6 py-4">
                        ₹{claim.claim_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {claim.fraud_score}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
                            riskColor[claim.risk]
                          }`}
                        >
                          {claim.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
