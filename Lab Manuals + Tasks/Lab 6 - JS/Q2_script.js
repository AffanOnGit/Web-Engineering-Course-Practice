let participants = []
const MAX_PARTICIPANTS = 5;

function addParticipant(name, email, ticketType) {
    let newParticipant = {
        name : name,
        email : email,
        ticketType : ticketType
    };
    participants.push(newParticipant);
}

let p1 = {
    name: "affan",
    email:"gmail.com",
    ticketType:"vip"
};

addParticipant(p1.name,p1.email,p1.ticketType);

//how to check availability? unclear
function checkAvailability() {
    return participants.length < MAX_PARTICIPANTS;
}


function listParticipants() {
    console.log(participants);
}

