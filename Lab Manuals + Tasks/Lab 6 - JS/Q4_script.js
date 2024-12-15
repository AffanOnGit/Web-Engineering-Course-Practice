let leaderboard = [];

function addPlayer(name) {
    let newPlayer = {
        name : name,
        // score : undefined
    }
    leaderboard.push(newPlayer);
}

function updateScore(name,score){
    for (let i = 0; i<leaderboard.length; i++) {
        if (leaderboard[i].name == name) {
            leaderboard[i].score = score;
        }
    }
}

//does not work for whatever reason. 
function getTopPlayers(){
    leaderboard.sort(
        function(a,b) {
            if (a.name > b.name) {
                return 1;
            }
            else if (a.name < b.name){
                return -1;
            }
            else {
                return 0;
            }
        }
    )
}

let play1 = {
    name: "affan",
}
let play2 = {
    name: "bilal",
}
let play3 = {
    name: "ali",
}

addPlayer(play1.name);
addPlayer(play2.name);
addPlayer(play3.name);

console.log(leaderboard);

updateScore("affan",15);
updateScore("bilal",10);
updateScore("ali",20);

console.log(leaderboard);

getTopPlayers();
console.log(leaderboard);