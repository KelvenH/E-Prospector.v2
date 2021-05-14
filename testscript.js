let liveGameData = {availableMiners:[
    {   device : 'Level 0 (Default)',
        consumption : 10,
        chance : 25,
        speed : 0,
        reliability : 100,
        status : 1},
    {   device:'Level 1',                                               
        consumption: 25,
        chance: 20,
        speed: 0,
        reliability: 100,
        status: 1}
]};


let item = {device : 'Level 1'};

let res = 0;

let matchingItem = liveGameData['availableMiners'].filter( (obj) => {

    if(obj.device === item.device){
        return true;
    }
    return false;
})

res = ( matchingItem[0].chance);
console.log( res);








let liveGameData = {availableMiners:[
    {   device : 'Level 0 (Default)',
        consumption : 10,
        chance : 25,
        speed : 0,
        reliability : 100,
        status : 1},
    {   device:'Level 1',                                               // REMEBER TO REMOVE LEVEL 1 - ONLY ADDED AT START FOR DEVELOPMENT PURPOSES
        consumption: 25,
        chance: 20,
        speed: 0,
        reliability: 100,
        status: 1}
]};

