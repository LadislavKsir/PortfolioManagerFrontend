export default function addParams(url: string, parameters: Parameter[]): string {
    let result = url
    parameters.forEach(param => {
            if (param.value !== undefined && param.value !== null && param.value !== "null") {
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

export function addPathVariable(url: string, pathVariable: string): string {
    if (url.endsWith("/")) {
        return url + pathVariable
    } else {
        return url + "/" + pathVariable
    }
}

export interface Parameter {
    key: string,
    value: any | undefined
}