export default function addParams(url: string, parameters: Parameter[]): string {
    let result = url
    parameters.forEach(param => {
            if (param.value !== undefined) {
                if (result.includes("?")) {
                    result = result + `&${param.key}=${param.value}`;
                } else {
                    result = result + `?${param.key}=${param.value}`;
                }
            }
        }
    )
    return result;
}

export interface Parameter {
    key: string,
    value: any | undefined
}