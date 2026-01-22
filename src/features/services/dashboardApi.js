import dashboardSummary from "../../data/dashboard.json";
import userPolicies from "../../data/policies.json";
import recommendations from "../../data/recommendations.json";
import claimsOverview from "../../data/claims.json";

export const getDashboardSummary = async () => {
  return { data: dashboardSummary };
};

export const getUserPolicies = async () => {
  return { data: userPolicies };
};

export const getRecommendations = async () => {
  return { data: recommendations };
};

export const getClaimsOverview = async () => {
  return { data: claimsOverview };
};
