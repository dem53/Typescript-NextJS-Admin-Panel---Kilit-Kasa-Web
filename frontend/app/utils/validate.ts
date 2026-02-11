
export const validateNumber = (numberValue: string) : boolean => {
    const regex = /^[0-9]*$/;
    return regex.test(numberValue);
}

export const validateCharacter = (stringValue: string) : boolean => {
    const regex = /^[a-z A-ZçÇiİöÖüÜğĞoO]*$/;
    return regex.test(stringValue);
}