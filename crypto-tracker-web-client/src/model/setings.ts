import { Asset } from './asset';

export class Settings {
  currency: string;
  assets: Asset[];

  constructor() {
    this.currency = 'USD';
    this.assets = [];
  }
}
