export class GetListingOptions {
  start: string;
  limit: string;
  convert: string;
  sort: string;
  sort_dir: string;

  constructor() {
    this.start = '1';
    this.limit = '5000';
    this.convert = 'USD';
    this.sort = 'market_cap';
    this.sort_dir = 'desc';
    return this;
  }
}
