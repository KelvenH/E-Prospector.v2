// Wait until DOM loaded before populating default Mining Device Stats
// Populate Default Chance & Power Consumption Stats 

var minerClass = document.getElementById('miner-class').innerText;
var minerChance = document.getElementById('miner-chance').innerText;
var minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);
var powerRate = parseInt(document.getElementById('power-rate').innerText);

document.addEventListener("DOMContentLoaded", function () {
    
    if (minerClass.includes('Level 0')) {
        minerChance = "25";                                                // Hard-coded - to be balanced !! 
        document.getElementById("miner-chance").innerText = minerChance;
        minerPowerConsumption = "10";                                      // Hard-coded - to be balanced !! 
        document.getElementById("miner-consumption").innerText = minerPowerConsumption;
    } else (console.log("ALERT! - Miner Class Not Found"));
    
    console.log("minerChance =", minerChance);
    console.log("powerUsage =", minerPowerConsumption);
    console.log("powerRate =", powerRate);
});


// Event listener for upgrade button

// Device upgrades A - User Selection

// Device upgrades B - Update Gameplay Stats

// Device upgrades C - Update Balance (post transaction)



// Event listener for run game button (initiate game cycle stages)

var play = document.getElementById('btn-play');
play.addEventListener('click', mineBlock);

function mineBlock (event) {
    console.log('button clicked id =', this.id);  

    
    // Game stage A(i) - generate miner ID / Key and display in Game Panel  
    
    var minerId = document.getElementById('terminal-key-device1').innerText;
    var minerId = 5;                                // ---------- {Baseline miner value fixed @ 5}
    console.log("minerId =", minerId);
    console.log("minerChance =", minerChance);
    
    // Game stage Aii - generate block ID
    
    var blockId = Math.floor(Math.random() * minerChance) + 1;
    console.log("blockId =", blockId);

    
    // Game stage B - check if block ID matches miner ID
   
    var blockSuccess = minerId === blockId;         // wil return true or false 
    console.log("blockSuccess =", blockSuccess);    

    calcSubTotal ();
    console.log("subTotal=", subTotal); 

}

    // Game Stage Ci - Calculate win

function calcRoundWin () {
    var roundWin = 100;                           // checks if true adds 100
    console.log("RoundWin=", roundWin);
        }


    // Game Stage Cii - Calculate costs

function calcRoundCost () {
    var roundCost = minerPowerConsumption * powerRate;
    console.log("PowerConsumption =", minerPowerConsumption);
    console.log("PowerRate =", powerRate);
    console.log("PowerCost =", roundCost);
}


// Game Stage D - Calculate Outcome 


function calcSubTotal () {

    var subTotal = 0;
   
    if (blockSuccess) {                                 //if true
        calcRoundWin ();
        calcRoundCost();
        subTotal = roundWin - roundCost;

    } else {
        calcRoundCost();
        subTotal = 0 - roundCost;                           // if false
    }
}



// Update Balance (post game-cycle)

function endRoundUpdateBalance () {
    var oldBalance = document.getElementById('balance-current').innerText;
    
    var newBalance = oldBalance + subTotal;
    console.log("oldBalance = ", oldBalance);
    console.log("subTotal", subTotal);
    console.log("newBalance", newBalance);
    document.getElementById('balance-current').innerText = newBalance;
}


// Reset screen for new game

//create template literals for terminal window messages


// Temporary - test feture button

var test = document.getElementById('btn-test');
test.addEventListener('click', endRoundUpdateBalance);