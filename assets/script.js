// Wait until DOM loaded before populating default Mining Device Stats
// Populate Default Chance & Power Consumption Stats 

var minerClass = document.getElementById('miner-class').innerText;
var minerChance = parseInt(document.getElementById('miner-chance').innerText);
var minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);
var powerRate = parseInt(document.getElementById('power-rate').innerText);
console.log("1. onload minerChance =", minerChance);
console.log("2. onload powerUsage =", minerPowerConsumption);
console.log("3. onload powerRate =", powerRate);

//  Refer 'hoisted' variable creations to support - is this the right method? Why variables not recognised across other functions if global?
var blockSuccess;
var subTotal;                                                           

document.addEventListener("DOMContentLoaded", function () {
    
    if (minerClass.includes('Level 0')) {
        minerChance = 25;                                                // Hard-coded - to be balanced !! 
        minerPowerConsumption = 10;                                      // Hard-coded - to be balanced !! 
        powerRate = 1;                                                   // Hard-coded - to be balanced !! 
        
    } else (console.log("ALERT! - Miner Class Not Found"));
    
    document.getElementById("miner-chance").innerText = minerChance;
    document.getElementById("miner-consumption").innerText = minerPowerConsumption;
    document.getElementById("power-rate").innerText = powerRate;

    console.log("4. updated minerChance =", minerChance);
    console.log("5. updated powerUsage =", minerPowerConsumption);
    console.log("6.updated powerRate =", powerRate);
});


// Event listener for upgrade button

// Device upgrades A - User Selection

// Device upgrades B - Update Gameplay Stats

// Device upgrades C - Update Balance (post transaction)



// Event listener for run game button (initiate game cycle stages)

var play = document.getElementById('btn-play');
play.addEventListener('click', mineBlock);

function mineBlock (event) {
    console.log("7. game round started /btn clicked id =", this.id);
    document.getElementById("terminal-status").innerText = "Activated";  

    
    // Game stage A(i) - generate miner ID / Key and display in Game Panel  
    
    var minerId = parseInt(document.getElementById('terminal-key-device1').innerText);
    minerId = 5;                                // ---------- {Baseline miner value fixed @ 5}
    document.getElementById("terminal-key-device1").innerText = minerId;
    
    console.log("8. minerId =", minerId);
    console.log("9. minerChance =", minerChance);
    
    // Game stage Aii - generate block ID
    
    var blockId = Math.floor(Math.random() * minerChance) + 1;
    document.getElementById("terminal-key-block1").innerText = blockId;
    console.log("10. blockId =", blockId);

    
    // Game stage B - check if block ID matches miner ID
   
    blockSuccess = minerId === blockId;         // wil return true or false 
    
    console.log("11. blockSuccess =", blockSuccess);
    
    calcSubTotal ();
    
    endRoundUpdateBalance ();

    // Game Stage D - Calculate Outcome 

    function calcSubTotal (subTotal) {
     
        var roundCost = calcRoundCost();  
        console.log("15. RoundCost[D] =", roundCost);       //not being returned as a value(?)

        var roundWin = calcRoundWin(roundWin);
        console.log("17. RoundWin[D] =", roundWin);         //not being returned as a value(?)

        var subTotal = roundWin - roundCost;
        console.log("18. subTotal[D] =", subTotal);         //not being returned as a value(?)
    };

   // Update Balance E - (post game-cycle)
        
    function endRoundUpdateBalance () {
        var oldBalance = parseInt(document.getElementById('balance-current').innerText);   
        console.log("19. oldBalance [E]= ", oldBalance);                                               //not being returned as a value(?)
    
        //subTotal = calcSubTotal ();
        //console.log("20. subTotal [E]", subTotal);                                                      //not being returned as a value(?)
    
        var newBalance = oldBalance + subTotal;
        document.getElementById('balance-current').innerText = newBalance.parseInt;  
        console.log("21. newBalance [E]", newBalance);                                                  //not being returned as a value(?)
    };
}

    // Game Stage Ci - Calculate costs

function calcRoundCost (roundCost) {
    roundCost = minerPowerConsumption * powerRate;
    
    console.log("12. PowerConsumption[C] =", minerPowerConsumption);
    console.log("13. PowerRate[C] =", powerRate);
    console.log("14. RoundCost[C] =", roundCost);
    
    return roundCost;
    }
        
        
      // Game Stage Cii - Calculate win

function calcRoundWin (roundWin) {
    if (blockSuccess) {
    i = +100;                        // checks if true (block mined) adds 100
    } else {
    i = 0;                           // checks if false (not mined) remains 0
    } 
    console.log("16. RoundWin[C]=", i);
    return roundWin = i;                          
    }




// Reset variables for new round(?)

//create template literals for terminal window messages


// Temporary - test feture button

//var test = document.getElementById('btn-test1');
//test.addEventListener('click', endRoundUpdateBalance);