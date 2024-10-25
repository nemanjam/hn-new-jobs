
interface Cache {
    url: Record<string, string>;
}

const cache: Cache = { url: {} };

export const getDocumentFromUrl = async (url: string) => {
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