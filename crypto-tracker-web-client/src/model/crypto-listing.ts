export interface CryptoListing {
  data: Datum[];
  status: Status;
}

export interface Currency {
  last_updated: Date;
  market_cap: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  price: number;
  volume_24h: number;
}

export interface Quote {
  USD: Currency;
}

export interface Datum {
  circulating_supply: number;
  cmc_rank: number;
  date_added: Date;
  id: number;
  last_updated: Date;
  max_supply: number;
  name: string;
  num_market_pairs: number;
  platform?: any;
  quote: Quote;
  slug: string;
  symbol: string;
  tags: string[];
  total_supply: number;
}

export interface Status {
  credit_count: number;
  elapsed: number;
  error_code: number;
  error_message?: any;
  notice?: any;
  timestamp: Date;
  total_count: number;
}
