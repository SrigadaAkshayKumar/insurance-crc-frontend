export const FRAUD_RULES = {
  "FRD-001": (claim) => {
    if (claim.claim_amount >= 0.8 * claim.sum_insured) {
      return { score: 30, label: "High claim amount" };
    }
    return { score: 0, label: null };
  },

  "FRD-002": (claim) => {
    const start = new Date(claim.policy_start_date);
    const claimDate = new Date(claim.claim_date);
    const days = (claimDate - start) / (1000 * 60 * 60 * 24);

    if (days <= 30) {
      return { score: 25, label: "Early policy claim" };
    }
    return { score: 0, label: null };
  },

  "FRD-003": (claim) => {
    if (claim.claims_last_6_months > 2) {
      return { score: 20, label: "Multiple claims in short duration" };
    }
    return { score: 0, label: null };
  },

  "FRD-004": (claim) => {
    if (!claim.documents_ok) {
      return { score: 20, label: "Document issues" };
    }
    return { score: 0, label: null };
  },

  "FRD-005": (claim) => {
    if (claim.shared_bank_account) {
      return { score: 30, label: "Shared bank account" };
    }
    return { score: 0, label: null };
  },
};
