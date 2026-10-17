export interface FactItem {
  id: string;
  metric: string;
  labelKey: string;
  descriptionKey: string;
  sourceName: string;
  sourceUrl: string;
  disclaimerKey?: string;
}

export const HONEST_FACTS: FactItem[] = [
  {
    id: 'india-exposure',
    metric: '47%',
    labelKey: 'facts.indiaExposure.label',
    descriptionKey: 'facts.indiaExposure.desc',
    sourceName: 'McAfee "Artificial Imposter" Report',
    sourceUrl: 'https://www.mcafee.com/en-us/consumer-corporate/newsroom/press-releases/press-release-details.html?news_id=20230508005312',
  },
  {
    id: 'financial-loss',
    metric: '83%',
    labelKey: 'facts.lossRate.label',
    descriptionKey: 'facts.lossRate.desc',
    sourceName: 'McAfee Global AI Scam Survey',
    sourceUrl: 'https://www.mcafee.com/en-us/consumer-corporate/newsroom/press-releases/press-release-details.html?news_id=20230508005312',
  },
  {
    id: 'detection-confusion',
    metric: '69%',
    labelKey: 'facts.confusion.label',
    descriptionKey: 'facts.confusion.desc',
    sourceName: 'McAfee AI Imposter Study',
    sourceUrl: 'https://www.mcafee.com/en-us/consumer-corporate/newsroom/press-releases/press-release-details.html?news_id=20230508005312',
  },
  {
    id: 'cyber-fraud-losses',
    metric: '₹22,849 Cr',
    labelKey: 'facts.totalLosses.label',
    descriptionKey: 'facts.totalLosses.desc',
    sourceName: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    sourceUrl: 'https://pib.gov.in',
  },
  {
    id: 'market-seniors',
    metric: '61 Million',
    labelKey: 'facts.marketCeiling.label',
    descriptionKey: 'facts.marketCeiling.desc',
    sourceName: 'IAMAI & Kantar Internet in India Report',
    sourceUrl: 'https://www.iamai.in',
    disclaimerKey: 'facts.marketCeiling.disclaimer',
  },
  {
    id: 'urban-seniors',
    metric: '17.7 Million',
    labelKey: 'facts.urbanMarket.label',
    descriptionKey: 'facts.urbanMarket.desc',
    sourceName: 'Telecom Regulatory Authority of India (TRAI)',
    sourceUrl: 'https://trai.gov.in',
    disclaimerKey: 'facts.urbanMarket.disclaimer',
  },
];
