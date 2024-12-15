let temperatures = [];


function addTemperature(temp) {
    temperatures.push(temp);
}

addTemperature(27);
addTemperature(34);
addTemperature(24);
addTemperature(22);
addTemperature(56);

console.log(temperatures);

function getHighestTemperature() {
    let highest = temperatures[0];
    for (let i = 1; i < temperatures.length; i++) {
        if (temperatures[i] > highest) {
            highest = temperatures[i];
        }
    }
    return highest;
}
console.log("Highest Temp is : " + getHighestTemperature());


function getLowestTemperature() {
    let lowest = temperatures[0];
    for (let i = 1; i < temperatures.length; i++) {
        if (temperatures[i] < lowest) {
            lowest = temperatures[i];
        }
    }
    return lowest;
}
console.log("Lowest number is: " + getLowestTemperature());

function getAverageTemperature() {
    let total = 0;
    for (let i=0; i < temperatures.length; i++) {
        total += temperatures[i];
    }
    return total/temperatures.length;
}

console.log("Average temperature is: " + getAverageTemperature());