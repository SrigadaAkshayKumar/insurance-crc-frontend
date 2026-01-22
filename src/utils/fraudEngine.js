import { FRAUD_RULES } from "./fraudRules";

export function calculateFraudWithRules(claim, selectedRules = []) {
  let score = 0;
  let triggered_rules = [];

  const rulesToApply =
    selectedRules.length > 0 ? selectedRules : Object.keys(FRAUD_RULES);

  rulesToApply.forEach((ruleId) => {
    const ruleFn = FRAUD_RULES[ruleId];
    if (ruleFn) {
      const { score: ruleScore, label } = ruleFn(claim);
      score += ruleScore;
      if (label) triggered_rules.push(label);
    }
  });

  let risk = "Low";
  if (score > 60) risk = "High";
  else if (score > 30) risk = "Medium";

  return {
    fraud_score: score,
    risk,
    triggered_rules,
  };
}
