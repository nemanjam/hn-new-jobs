async function parse({ saveAsFile = true, whichMonths = 'last-two' }) {
  //

  async function main() {
    switch (whichMonths) {
      case 'last-two':
        await compareLastTwoMonths();
        break;
      case 'all':
        await compareAllMonths();
        break;
      case 'companies':
        await getNumberOfMonthsForLastMonthsCompanies();
        break;

      default:
        break;
    }
  }

  const fileNames = {
    outputAllMonths: 'output-all-months.json',
    outputLastTwoMoths: 'output-last-two-months.json',
    outputAllCompanies: 'output-all-companies.json',
  };

  await main();
}

(function () {
  const options = {
    saveAsFile: true,
    whichMonths: 'last-two',
  };

  parse(options);
})();
