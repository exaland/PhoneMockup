export interface AlternateUrls {
  en: string;
  zh: string;
  default: string;
}

export interface UrlConfig {
  canonicalUrl: string;
  alternateUrls: AlternateUrls;
}

export const getUrlConfig = (path: string, lang: 'en' | 'zh'): UrlConfig => {
  const baseUrl = 'https://appcrafter.dev';
  
  return {
    canonicalUrl: lang === 'en' ? `${baseUrl}${path}` : `${baseUrl}/zh${path}`,
    alternateUrls: {
      en: `${baseUrl}${path}`,
      zh: `${baseUrl}/zh${path}`,
      default: `${baseUrl}${path}`
    }
  };
}; 