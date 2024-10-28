export const CONFIG = {
  saveAsFile: true,
  whichMonths: 'last-two',
  fetchWaitSeconds: 5,
  fileNames: {
    outputAllMonths: 'output-all-months.json',
    outputLastTwoMoths: 'output-last-two-months.json',
    outputAllCompanies: 'output-all-companies.json',
  },
} as const;
