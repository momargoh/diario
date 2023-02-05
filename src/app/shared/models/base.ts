export abstract class DataModelBase {
  id: string | null = null;

  constructor(params?: { [key: string]: any }) {
    if (params) {
      Object.assign(this, params);
    }
  }

  /**Return JSON object compatible with backend */
  serialize() {}

  /**Deserialize data coming from backend */
  static deserialize(json: any) {
    throw new Error(`${this.constructor.name}.deserialize() not defined`);
  }
}

export type DataModelBaseSerialized = {
  id: string | null;
};
