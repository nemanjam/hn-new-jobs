export const parseCompaniesForThread = async (threadUrl: string): Promise<PCompany[]> => {
    const pagesUrls = await getThreadPagesUrlsForMonth(threadUrl);
  
    // const allCompanies: PCompany[] = [];
  
    // for (const pageUrl of pagesUrls) {
    //   const companies = await parseCompaniesForPage(pageUrl);
    //   allCompanies.push(...companies);
    // }
  
    // return allCompanies;
  
    const allCompaniesMatrix = await Promise.all(
      pagesUrls.map(async (pageUrl) => parseCompaniesForPage(pageUrl))
    );
    const allCompanies = allCompaniesMatrix.flat();
    
    return allCompanies;
  };