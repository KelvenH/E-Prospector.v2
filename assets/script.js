// Wait until DOM loaded before populating default Mining Device Stats
// Populate Default Chance & Power Consumption Stats 

let minerClass = document.getElementById('miner-class').innerText;
let minerChance = parseInt(document.getElementById('miner-chance').innerText);
let minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);

document.addEventListener("DOMContentLoaded", function () {
    
    if (minerClass.includes('Level 0')) {
        minerChance = "5";
        minerPowerConsumption = "10";  
    } else (console.log("ALERT! - Miner Class Not Found"));
    
    console.log("minerChance:", minerChance);
    console.log("powerUsage:", minerPowerConsumption);
});


// Event listener for upgrade button

// Device upgrades A - User Selection

// Device upgrades B - Update Gameplay Stats

// Device upgrades C - Update Balance (post transaction)



// Event listener for run game button (initiate game cycle stages)

let play = document.getElementById('btn-play');
play.addEventListener('click', mineBlock);

function mineBlock (event) {
    console.log('button clicked id:', this.id);  

    
    // Game stage A(i) - generate miner ID / Key and display in Game Panel  
    
    var minerId = document.getElementById('terminal-key-device1').innerText;
    var minerId = 5;             // ---------- {Baseline value fixed @ 5}
    console.log("minerId:", minerId);
    console.log("minerChance:", minerChance);
    
    // Game stage Aii - generate block ID
    
    var blockId = Math.floor(Math.random() * minerChance) + 1;
    console.log("blockId:", blockId);

    
    // Game stage B - check if block ID matches miner ID
   
    let blockSuccess = minerId === blockId;
    console.log("blockSuccess:", blockSuccess);
    
    if (blockSuccess) {
        coinMined ()
    } else {
        notMined();
    }
}
    
    // Game Stage C - Calculate costs

    function costs () {
    let cost = minerPowerConsumption;
    let balance = parseInt(document.getElementById('current-balance').innerText);
    console.log("balance was:", balance);
    let subTotal = balance - cost;
    console.log("new balance", subTotal);
    }    

// Game Stage D - Calculate Outcome 

function notMined () {
    costs ();
}

function coinMined () {
    
}



// Update Balance (post game-cycle)

// Reset screen for new game

//create template literals for terminal window messages