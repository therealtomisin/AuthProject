export const intertionalize = (number: string, code = "+234") => {
    const newNumber = number.split('').reverse().join('').slice(0,10).split('').reverse().join('')
    return (`${code}${newNumber}`)
}