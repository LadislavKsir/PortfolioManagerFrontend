type ParamValue = string | number | boolean | null | undefined;

export default class UrlBuilderNew {
    private baseUrl: string;
    private params: Record<string, ParamValue> = {};

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    addParameter(key: string, value: ParamValue): this {
        if (value !== undefined && value !== null && value !== "null") {
            this.params[key] = value;
        }
        return this;
    }

    build(): string {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(this.params)) {
            searchParams.append(key, String(value));
        }
        return Object.keys(this.params).length > 0
            ? `${this.baseUrl}?${searchParams.toString()}`
            : this.baseUrl;
    }
}

export const urlBuilder = (base: string) => new UrlBuilderNew(base);