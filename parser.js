
async function parse({ saveAsFile = true, whichMonths = 'last-two' }) {

    const cache = { url: {} };

    async function getDocumentFromUrl(url) {
        if (!cache.url?.[url]) {
            const response = await fetch(url);
            cache.url[url] = await response.text();
            await sleep(5);
        }

        const htmlContent = cache.url[url];

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        return doc;
    }

    async function getThreads() {
        const threadsUrl = 'https://news.ycombinator.com/submitted?id=whoishiring';
        const threadsSelector = 'tr.athing span.titleline a';
        const monthRegex = /.*(?:hiring).*?\((\w+)/;

        const doc = await getDocumentFromUrl(threadsUrl);
        const threadsNodes = doc.querySelectorAll(threadsSelector)

        const threads = []

        for (const threadNode of threadsNodes) {
            const text = threadNode.textContent;
            const match = text.match(monthRegex);
            const month = match ? match[1].trim() : null;
            if (!month) continue;

            const link = threadNode.href;

            const thread = { month, link };
            threads.push(thread)
        }

        return threads;
    }

    async function getThreadUrlFromMonth(month) {
        const threads = await getThreads();

        const thread = threads.find(thread => thread.month === month);
        const link = thread.link;

        return link;
    }

    async function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async function getPagesUrlsForMonth(threadUrl) {
        const postsSelector = '.athing.comtr:has([indent="0"]) .commtext:first-child';

        const pagesUrls = []

        for (let page = 1; page < 10; page++) {
            const pageUrl = `${threadUrl}&p=${page}`;
            try {
                const doc = await getDocumentFromUrl(pageUrl); 
                const postsNodes = doc.querySelectorAll(postsSelector);
                if (!(postsNodes.length > 0)) break;
                
                pagesUrls.push(pageUrl);
            } catch (error) {}
        }

        return pagesUrls;
    }

    async function getCompanies(threadUrl) {
        const postsSelector = '.athing.comtr:has([indent="0"])';
        const titleChildSelector = '.commtext:first-child';
        const linkChildSelector = 'span.age a';

        const companyNameRegex = /^([^|]+)\|/;
        const removeLinkOrBracesRegex = /^(.*?)\s*(?:\([^)]*\)|https?:\/\/\S+)/;

        const doc = await getDocumentFromUrl(threadUrl);
        const postsNodes = doc.querySelectorAll(postsSelector)
        
        const companies = []

        for (const postNode of postsNodes) {
            const titleNode = postNode.querySelector(titleChildSelector);
            if (!titleNode) continue;

            const titleText = titleNode.textContent.trim(); 
            const match = titleText.match(companyNameRegex); 
            let name = match ? match[1].trim() : null;
            if (!name) continue;

            const urlMatch = name.match(removeLinkOrBracesRegex);
            name = urlMatch ? urlMatch[1].trim() : name;

            const linkNode = postNode.querySelector(linkChildSelector);
            const link = linkNode.href;

            const company = { name, link };
            companies.push(company);
        }

        return companies
    }

    async function getCompaniesForMonth(threadUrl) {
        const pagesUrls = await getPagesUrlsForMonth(threadUrl);

        const allCompanies = []

        for (const pageUrl of pagesUrls) {
            const companies = await getCompanies(pageUrl);
            allCompanies.push(...companies);
        }

        return allCompanies;
    }

    function compareCompanies(company1, company2) {
        const isEqual = company1.name === company2.name;
        // console.log('isEqual: ', isEqual, `${company1.name} === ${company2.name}`);

        return isEqual;
    }

    function getNewAndOldCompanies(companies1, companies2) {
        const newCompanies = [];
        const oldCompanies = [];

        for (const company2 of companies2) {
            let isNew = true;
            for (const company1 of companies1) {
                const isEqual = compareCompanies(company1, company2);
                if (isEqual) {
                    isNew = false;
                    break;
                }           
            }
            if (isNew) {
                newCompanies.push(company2);
            } else {
                oldCompanies.push(company2);
            }
        }

        const result = { newCompanies, oldCompanies };
        return result;
    }

    function formatResult(input) {
        const { result, month1, month2 } = input;
        const { newCompanies, oldCompanies } = result;

        const totalCount = newCompanies.length + oldCompanies.length;
        const newCount = newCompanies.length;
        const oldCount = oldCompanies.length;
        const percentageOfNew = `${Math.round((newCount / totalCount) * 100)}%`;
        const percentageOfOld = `${Math.round((oldCount / totalCount) * 100)}%`;
        const newNames = newCompanies.map(company => company.name);
        const oldNames = oldCompanies.map(company => company.name);

        const output = { 
            forMonth: month2,
            comparedToMonth: month1,
            totalCount,
            newCount,
            oldCount,
            percentageOfNew,
            percentageOfOld,
            newNames,
            oldNames,
            newCompanies,
            oldCompanies,
        };

        return output;
    }

    function downloadAsJsonFile(data, fileName) {
        const jsonString = JSON.stringify(data, null, 2);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);

        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    async function getAllMonths() {
        const allThreads = await getThreads();
        const allMonths = allThreads.map(thread => thread.month);
        const monthPairs = allMonths.slice(0, -1).map((value, index) => ({month2: value, month1: allMonths[index + 1]}));
        const result = { allMonths, monthPairs };
        return result;
    }

    async function compareTwoMonths(month1, month2) {
        const threadUrl1 = await getThreadUrlFromMonth(month1);
        const threadUrl2 = await getThreadUrlFromMonth(month2);

        const companies1 = await getCompaniesForMonth(threadUrl1);
        const companies2 = await getCompaniesForMonth(threadUrl2);

        const result = getNewAndOldCompanies(companies1, companies2);

        const input = { result, month1, month2 };
        const output = formatResult(input);

        return output;
    }

    async function compareAllMonths() {
        const parsedMonths = await getAllMonths();
        const { allMonths, monthPairs } = parsedMonths;

        const allResults = [];

        for (const monthPair of monthPairs) {
            const result = await compareTwoMonths(monthPair.month1, monthPair.month2);
            allResults.push(result);
        }

        if (saveAsFile) {
            const output = { allMonths, allResults };
            downloadAsJsonFile(output, fileNames.outputAllMonths);
        }

        console.log(allMonths);
        console.table(allResults);
    }

    async function compareLastTwoMonths() {
        const parsedMonths = await getAllMonths();
        const { monthPairs } = parsedMonths;

        const monthPair = monthPairs[0];
        const result = await compareTwoMonths(monthPair.month1, monthPair.month2);

        const output = { result };

        if (saveAsFile) {
            downloadAsJsonFile(output, fileNames.outputLastTwoMoths);
        }
        console.table(output);
    }

    async function getNumberOfMonthsForLastMonthsCompanies() {
        const parsedMonths = await getAllMonths();
        const { allMonths } = parsedMonths;

        const month1 = allMonths[0];
        const threadUrl1 = await getThreadUrlFromMonth(month1);
        const companies1 = await getCompaniesForMonth(threadUrl1);

        const allCompanies = [];
        for (const company1 of companies1) {
            const company = { ...company1, months: [], monthsCount: 0, ads: [] };
            for (const month of allMonths) {
                const threadUrl2 = await getThreadUrlFromMonth(month);
                const companies2 = await getCompaniesForMonth(threadUrl2);

                let isFound = false;
                let companyAd = null;
                for (const company2 of companies2) {

                    const isEqual = compareCompanies(company1, company2);
                    if (isEqual) {
                        isFound = true;
                        companyAd = { ...company2, month }
                        break;
                    }     
                }
                if (isFound) {
                    company.months.push(month);
                    company.ads.push(companyAd);
                    company.monthsCount++;
                }
            }
            allCompanies.push(company);
            console.log('company', company);
        }

        allCompanies.sort((a, b) => b.monthsCount - a.monthsCount);

        if (saveAsFile) {
            const output = { allCompanies };
            downloadAsJsonFile(output, fileNames.outputAllCompanies);
        }

        console.table(allCompanies);
    }

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

(function() {
    const options = {
        saveAsFile: true,
        whichMonths: 'last-two',
    }

    parse(options);
})();


