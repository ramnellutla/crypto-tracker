export interface Currency {
  altcoin_market_cap: number;
  altcoin_volume_24h: number;
  altcoin_volume_24h_reported: number;
  last_updated: Date;
  total_market_cap: number;
  total_volume_24h: number;
  total_volume_24h_reported: number;
}

export interface Quote {
  USD: Currency;
}

export interface Data {
  active_cryptocurrencies: number;
  active_exchanges: number;
  active_market_pairs: number;
  btc_dominance: number;
  eth_dominance: number;
  last_updated: Date;
  quote: Quote;
}

export interface Status {
  credit_count: number;
  elapsed: number;
  error_code: number;
  error_message?: any;
  notice?: any;
  timestamp: Date;
}

export interface GlobalMetrics {
  data: Data;
  status: Status;
}
