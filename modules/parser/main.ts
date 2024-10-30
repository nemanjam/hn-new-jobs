import {
  compareAllMonths,
  compareLastTwoMonths,
  getNumberOfMonthsForLastMonthsCompanies,
} from '@/modules/parser/months';

async function parse({ whichMonths = 'last-two' }) {
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

  await main();
}

(function () {
  const options = {
    whichMonths: 'last-two',
  };

  parse(options);
})();
