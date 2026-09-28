export function stringToVector3(input) {
    if (Array.isArray(input)) {
        return input.map(str => stringToVector3(str));
    }
    else {
        const values = input.split(' ');
        return { x: parseFloat(values[0]), y: parseFloat(values[1]), z: parseFloat(values[2]) };
    }
}
