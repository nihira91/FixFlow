

const Issue = require("../models/issue.model");

exports.calculateSLAService = async () => {
  const issues = await Issue.find();

  let met = 0;
  let breached = 0;

  issues.forEach((issue) => {
    if (!issue.resolvedAt) return;

    const resolutionTime = issue.resolvedAt - issue.createdAt;

    const slaHours = issue.priority === "high" ? 24 : 48;

    if (resolutionTime <= slaHours * 60 * 60 * 1000) {
      met++;
    } else {
      breached++;
    }
  });

  return {
    totalIssues: issues.length,
    slaMet: met,
    slaBreached: breached,
  };
};
