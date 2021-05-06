// Wait until DOM loaded before populating default Mining Device Stats
// Populate Default Chance & Power Consumption Stats 

var minerClass = document.getElementById('miner-class').innerText;
var minerChance = parseInt(document.getElementById('miner-chance').innerText);
var minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);
var powerRate = parseInt(document.getElementById('power-rate').innerText);
console.log("onload minerChance =", minerChance);
console.log("onload powerUsage =", minerPowerConsumption);
console.log("onload powerRate =", powerRate);

//  Refer 'hoisted' variable creations to support - is this the right method? Why var not identified in other functions if global?
var blockSuccess;
var subTotal;                                                           

document.addEventListener("DOMContentLoaded", function () {
    
    if (minerClass.includes('Level 0')) {
        minerChance = 25;                                                // Hard-coded - to be balanced !! 
        minerPowerConsumption = 10;                                      // Hard-coded - to be balanced !! 
        powerRate = 20;                                                   // Hard-coded - to be balanced !! 
        
    } else (console.log("ALERT! - Miner Class Not Found"));
    
    document.getElementById("miner-chance").innerText = minerChance;
    document.getElementById("miner-consumption").innerText = minerPowerConsumption;
    document.getElementById("power-rate").innerText = powerRate;

    console.log("updated minerChance =", minerChance);
    console.log("updated powerUsage =", minerPowerConsumption);
    console.log("updated powerRate =", powerRate);
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
    
    var minerId = parseInt(document.getElementById('terminal-key-device1').innerText);
    minerId = 5;                                // ---------- {Baseline miner value fixed @ 5}
    document.getElementById("terminal-key-device1").innerText = minerId;
    
    console.log("minerId =", minerId);
    console.log("minerChance =", minerChance);
    
    // Game stage Aii - generate block ID
    
    var blockId = Math.floor(Math.random() * minerChance) + 1;
    document.getElementById("terminal-key-block1").innerText = blockId;
    console.log("blockId =", blockId);

    
    // Game stage B - check if block ID matches miner ID
   
    blockSuccess = minerId === blockId;         // wil return true or false 
    document.getElementById("terminal-status").innerText = "Activated";
    console.log("blockSuccess =", blockSuccess);
    calcSubTotal ();
    

    // Game Stage D - Calculate Outcome 

    function calcSubTotal () {
     
        var roundCost = calcRoundCost ();
        console.log("RoundCost[D] =", roundCost);       //not being returned as a value(?)

        var roundWin = calcRoundWin ();
        console.log("RoundWin[D] =", roundWin);         //not being returned as a value(?)

        var subTotal = roundWin - roundCost;
        console.log("subTotal[D] =", subTotal);         //not being returned as a value(?)
    };

    // Update Balance (post game-cycle)
    endRoundUpdateBalance ();
}

    // Game Stage Ci - Calculate costs

function calcRoundCost () {
    roundCost = minerPowerConsumption * powerRate;
    console.log("PowerConsumption[C] =", minerPowerConsumption);
    console.log("PowerRate[C] =", powerRate);
    console.log("RoundCost[C] =", roundCost);
}
        
        
      // Game Stage Cii - Calculate win

function calcRoundWin () {
    if (blockSuccess) {
    roundWin = +100;                        // checks if true (block mined) adds 100
    } else {
    roundWin = 0;                           // checks if false (not mined) remains 0
    }                           
    console.log("RoundWin[C]=", roundWin);
}


function endRoundUpdateBalance () {
    var oldBalance = parseInt(document.getElementById('balance-current').innerText);   
    console.log("oldBalance = ", oldBalance);                                               //not being returned as a value(?)

    console.log("subTotal", subTotal);                                                      //not being returned as a value(?)

    var newBalance = oldBalance + subTotal;
    document.getElementById('balance-current').innerText = newBalance;  
    console.log("newBalance", newBalance);                                                  //not being returned as a value(?)
    
}


// Reset variables for new round(?)

//create template literals for terminal window messages


// Temporary - test feture button

var test = document.getElementById('btn-test1');
test.addEventListener('click', endRoundUpdateBalance);