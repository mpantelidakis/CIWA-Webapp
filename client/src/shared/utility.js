export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

export const checkValidity = (value, rules) => {
    let isValid = true
    if (rules.required) {
        // isValid is true if value is not an empty string
        isValid = value.trim() !== '' && isValid
    }
    
    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if ( rules.isEmail ) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test( value ) && isValid
    }

    if ( rules.isFloat ) {
        const pattern = /^[-+]?[0-9]*\.?[0-9]+$/
        isValid = pattern.test( value ) && isValid
    }

    if ( rules.maxValue ) {
        isValid = value <= rules.maxValue && isValid
    }

    if ( rules.minValue ) {
        isValid = value >= rules.minValue && isValid
    }

    return isValid
}