import { JSDOM } from 'jsdom';

export const isValidHtmlContent = (htmlContent: string): boolean => {
  const doc: Document = new JSDOM(htmlContent).window.document;

  const isValid = Boolean(
    doc && doc.documentElement && doc.querySelector('html') && doc.querySelector('body')
  );

  return isValid;
};

export const shortHtml = (htmlContent: string): string => htmlContent.slice(0, 50) + '...';
