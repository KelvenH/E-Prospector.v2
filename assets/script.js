
/*--- Key Steps & Sequence -----------------------------------------------------//
0.0 - Utilities (temp to be removed!!)
0.1 - Global variables initiated
0.2 - Game data tables / library created
    - mainDataLibrary (all game data)
    - LiveGameData (populated with default data and pulls from mainData library as game progresses)

1. On Load - miner table loads with default starter device and balance 

2. Upgrade device;
        a - populate upgrade shop (event = player opening modal)
        b - action player purchase (event = player clicks 'purchase' button);
            i - device status changed (mainDataLibrary) indicating miner now available for selection
            ii - transaction processed (player live balance reduced)
            iii - liveGameData updated to 'append' purchased device (user able to select from drop-down of available devices) 
        c - (not in baseline version) player able to purchase additional 'terminal' i.e. run multiple devices

3. (not in baseline) changes to power source / cost rate 

4. Run Game (event = player clicks to run new round);
        a - game generates device and block keys (linked to active device probability range) 
        b - checks if match 
        c - if win calculate winnings
        d - calc round costs (i.e. active device power consumpation x power unit rate)
        e - calc subTotal (i.e. balance + winnings - cost)
        f - update balance

5. Event (not in baseline - may move to being additional step in Run Game sequence) generate event, log player response, generate outcome and apply affect (e.g. + / - balance)

6. X-change (not in baseline) - player exchanges e-coin for £ 

--------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------
//  0.0 Utilities - used in development only - to be removed from final submission
//-------------------------------------------------------------------------------*/

/*--------
function checkifNaN(x) {
    if (isNaN(x)) {
      return NaN;
    }
    return x;
  }
---*/

//console.log(checkifNaN('1'));

// Temporary - test feature button

//let test = document.getElementById('btn-test1');
//test.addEventListener('click', endRoundUpdateBalance);





/*---------------------------------------------------------------------------------
//   0.1 - Global variables
//  Variables 'hoisted' to global for visibility across functions - refer with mentor if correct approach??
//-------------------------------------------------------------------------------*/



//let minerClass = document.getElementById('miner-class').innerText;
let minerChance = parseInt(document.getElementById('miner-chance').innerText);
let minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);
let powerRate = parseInt(document.getElementById('power-rate').innerText);
console.log("1. onload minerChance =", minerChance);                                            //development only - to be removed
// console.log(checkifNaN(minerChance));                                                        //development only - to be removed
console.log("2. onload powerUsage =", minerPowerConsumption);                                   //development only - to be removed
// console.log(checkifNaN('minerPowerConsumption'));                                            //development only - to be removed
console.log("3. onload powerRate =", powerRate);                                                //development only - to be removed
// console.log(checkifNaN(powerRate));                                                          //development only - to be removed

let blockSuccess;


/*---------------------------------------------------------------------------------
//   0.2 - Game data tables / library;
//-------------------------------------------------------------------------------*/

//Mining devices;

/*---
[1]name            [2]purchaseCost   [3]minerPowerConsumption    [4]minerChance   [5*]speed (timer) [6*]reliability  [7i]status
Level 0 (Default)       0                10                         25              0               100             1
Level 1                 50               25                         20              0               100             0
Level 2                 250              50                         15              0               100             0
Level 3                 500              150                        10              0               100             0  
Level 4                 1000             250                        2               0               100             0

[1] - [6] : displayed to user in device information   +   upgrade shop
[7] : hidden from user 
[**] - not invoked for baseline version but planned for future enhancement
[i] - status, 0 = not available (i.e. not purchased), 1 = available (default or purchased) 
----*/


let mainDataLibrary = {miningDevices:[                      // further items to be added to the data tables as developed e.g. variable power costs
    {   device:'Level 0 (Default)',
        purchaseCost: 0,
        consumption: 10,
        chance: 25,
        speed: 0,
        reliability: 100,
        status: 1},
    {   device:'Level 1',
        purchaseCost: 50,
        consumption: 25,
        chance: 20,
        speed: 0,
        reliability: 100,
        status: 0},
    {   device:'Level 2',
        purchaseCost: 250,
        consumption: 50,
        chance: 15,
        speed: 0,
        reliability: 100,
        status: 0},
    {   device:'Level 3',
        purchaseCost: 500,
        consumption: 150,
        chance: 10,
        speed: 0,
        reliability: 100,
        status: 0},
    {   device:'Level 4',
        purchaseCost: 1000,
        consumption: 250,
        chance: 2,
        speed: 0,
        reliability: 100,
        status: 0},
]};

//upon player purchasing upgrade, data from the main table will be passed to the 'live' version which becomes the source data for the player to use (i.e. can't 'use' a device which has not been purchased). it also means retaining a devices original stats should future development enable short term changes to the live data (e.g. temporary performance boost);

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

   
/*---------------------------------------------------------------------------------
//  1.0 Prepare Game On DOM Load;
//      Wait until DOM loaded then obtain miner details from 'liveGameData' (default only available at start)
//      Data used to populate the HTML fields (dropdown menu, and performance stats)
//-------------------------------------------------------------------------------*/


document.addEventListener("DOMContentLoaded", function () {             // Waits for the DOM to load before executing the initial game prep


//populates drop-down with available miners

let minerDropdown = document.getElementById("miner-list");              //acknowledgement for the code  https://www.youtube.com/watch?v=AqgVLYpBWG8

let arr = liveGameData['availableMiners'];                              // on initial load only the default device will be available for player to select in the device dropdown
    for (let i=0, len=arr.length; i<len; i++){
        
        console.log(arr[i].device);
        minerDropdown.options.add(new Option(arr[i].device));
    };

});                                                                     // end of onload function


//update miner stats 'in-play' after selection of device (function can be accessed at any time outside of 'mine block'game cycle)

$("#miner-list").change(function(){                                       //using Jquery to identify when change made to miner dropdown selection
    
        
   //let item = {device : 'Level 1'};                                      //CHANGE HARD-CODED VALUE TO VARIABLE MATCHING HTML ID - NEED TO APPEND 'KEY' TO 'VALUE'

   let txt = document.getElementById("miner-list").value;
   console.log(txt);

   let item = {device : txt};  
    console.log(item);
 
    let resA = 0;                                                          //resA = success likelihood (chance)
    let resB = 0;                                                          //resB = power consumption (consumption)
    let resP = 1;                                                          //resP = power cost per unit - fixed @£1 baseline version (hard coded but to be fed from datatable if variable costs added) 

    let matchingItem = liveGameData['availableMiners'].filter( (obj) => {   //acknowledgement for  https://www.youtube.com/watch?v=w84qY9peByk&t=321s

        if(obj.device === item.device){
            return true;
        }
            return false;
    })

    resA = ( matchingItem[0].chance);
    resB = ( matchingItem[0].consumption);
    console.log('chance', resA);
    console.log('consumption', resB);

    $("#miner-chance").text(resA);                                             //update html fields with the matching value (chance)
    $("#miner-consumption").text(resB);                                        //update html fields with the matching value (consumption)
    $("#power-rate").text(resP);                                               //update html fields with the matching value (cost per unit) 

    minerChance = resA;
    minerPowerConsumption = resB;
    powerRate = resP;

});



/*---------------------------------------------------------------------------------
//   2. Upgrade device;
        a - populate upgrade shop (event = player opening modal)
        b - action player purchase (event = player clicks 'purchase' button);
            i - device status changed (mainDataLibrary) indicating miner now available for selection
            ii - transaction processed (player live balance reduced)
            iii - liveGameData updated to 'append' purchased device (user able to select from drop-down of available devices) 
        c - (not in baseline version) player able to purchase additional 'terminal' i.e. run multiple devices
//-------------------------------------------------------------------------------*/
// Add Event listener for upgrade button

// Device upgrades A - User Selection

// Device upgrades B - Update Gameplay Stats

// Device upgrades C - Update Balance (post transaction)



/*---------------------------------------------------------------------------------
//   3. (not in baseline) changes to power source / cost rate 
//-------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------
//   4. Run Game (event = player clicks to run new round);
        a - game generates device and block keys (linked to active device probability range) 
        b - checks if match 
        c - calc outcome,subTotal (last balance + winnings - costs); 
            i) associated power costs (power consumpation x power unit rate)
            ii) winnings (if keys match)
        d - update current balance (last balance + round subTotal)
//-------------------------------------------------------------------------------*/

// Run Game - Event listener for run game button (initiate game cycle stages)

let play = document.getElementById('btn-play');
play.addEventListener('click', mineBlock);

function mineBlock (event) {
    console.log("7. game round started / btn id =", this.id);                   //development only - to be removed??
    document.getElementById("terminal-status").innerText = "Activated";  

    
    // Game stage Ai - generate miner ID / Key and display in Game Panel  
    
    let minerId = Math.floor(Math.random() * minerChance) + 1;
    document.getElementById("terminal-key-device1").innerText = minerId;        
    
    console.log("8. minerId =", minerId);                                       //development only - to be removed??
    // console.log(checkifNaN(minerId));                                        //development only - to be removed??
    console.log("9. minerChance =", minerChance);                               //development only - to be removed??
    // console.log(checkifNaN(minerChance));                                    //development only - to be removed??
    
    // Game stage Aii - generate block ID
    
    let blockId = Math.floor(Math.random() * minerChance) + 1;
    document.getElementById("terminal-key-block1").innerText = blockId;
    console.log("10. blockId =", blockId);                                      //development only - to be removed??
    // console.log(checkifNaN(blockId));                                        //development only - to be removed??

    
    // Game stage B - check if block ID matches miner ID
   
    blockSuccess = minerId === blockId;                                        // will return true or false 
    
    console.log("11. blockSuccess =", blockSuccess);                           //development only - to be removed??
    // console.log(checkifNaN(blockSuccess));                                  //development only - to be removed??
    

    // Game Stage C - Calculate Outcome 

    let subTotal = calcSubTotal ();                                           // subTotal hoisted out of code-block so as it can be seen / within scope of function which updates balance (but demoted from global as caused an undefined error - likely due to sequencing?
    
            
    function calcSubTotal (subTotal) {
     
        let roundCost = calcRoundCost();  
        console.log("15. RoundCost[D] =", roundCost);                          //development only - to be removed??
        // console.log(checkifNaN(roundCost));                                 //development only - to be removed??

        let roundWin = calcRoundWin();
        console.log("17. RoundWin[D] =", roundWin);                            //development only - to be removed??
        // console.log(checkifNaN(roundWin));                                  //development only - to be removed??

        let i = roundWin - roundCost;
        console.log("18. subTotal[D] =", i);                                    //development only - to be removed??
        // console.log(checkifNaN(i));                                          //development only - to be removed??
        return subTotal = i;
    };

    endRoundUpdateBalance ();

    

   // Game stage D - Update Balance 
        
function endRoundUpdateBalance () {

        
    let oldBalance = parseInt(document.getElementById('balance-current').innerText);   
    console.log("19. oldBalance [E]= ", oldBalance);                        //development only - to be removed??                                                    
    // console.log(checkifNaN(oldBalance));                                 //development only - to be removed??
    
    console.log("20. subTotal [E]", subTotal);                              //development only - to be removed??                        
    // console.log(checkifNaN(subTotal));                                   //development only - to be removed??
        
    let newBalance = 0;
        newBalance = oldBalance + subTotal;
        document.getElementById('balance-current').innerText = newBalance;      
        console.log("21. newBalance [E]", newBalance);                         //development only - to be removed?? 
    // console.log(checkifNaN(newBalance));                                //development only - to be removed??
    };

    function endRoundStyling () {                                              // changes to default styling if condition met e.g. negative values displayed in red
        document.getElementsByClass("field-value").style.color= "red";
 }
};

    //The following functions are called in the above Run Game cycle if condition(s) met

    // Game Stage Ci - Calculate costs

function calcRoundCost (roundCost) {
    roundCost = minerPowerConsumption * powerRate;
    
    console.log("12. PowerConsumption[C] =", minerPowerConsumption);            //development only - to be removed??
    // console.log(checkifNaN(minerPowerConsumption));                          //development only - to be removed??
    console.log("13. PowerRate[C] =", powerRate);                               //development only - to be removed??
    // console.log(checkifNaN(powerRate));                                      //development only - to be removed??
    console.log("14. RoundCost[C] =", roundCost);                               //development only - to be removed??
    // console.log(checkifNaN(roundCost));                                      //development only - to be removed??
    
    return roundCost;
}
        
        
      // Game Stage Cii - Calculate win

function calcRoundWin (roundWin) {
    if (blockSuccess) {
    ii = +1000;                        // checks if true (block mined) // reward value fixed at 1000 for baseline
     } else {
    ii = 0;                           // checks if false (not mined) remains 0
    } 
    console.log("16. RoundWin[C]=", ii);                                        //development only - to be removed??
    // console.log(checkifNaN(ii));                                             //development only - to be removed??
    return roundWin = ii;                          
}


/*---------------------------------------------------------------------------------
//   5. Events (not in baseline)
//-------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------
//   6. X-change (not in baseline)
//-------------------------------------------------------------------------------*/
