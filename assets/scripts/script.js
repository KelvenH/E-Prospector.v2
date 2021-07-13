/jshint esversion:8, jquery:true/

/*--- Key Steps & Sequencing -----------------------------------------------------/
0.0 - Utilities (import JSON)
0.1 - Global variables initiated

1. Load New Game Data - miner table loads with default starter device and balance 

2. Upgrade Parts;
        a - populate upgrade shop (event = player opening modal)
        b - action player purchase (event = player clicks 'purchase' button);
            i - device status changed (mainDataLibrary) indicating miner now available for selection
            ii - transaction processed (player live balance reduced)
            iii - liveGameData updated to 'append' purchased device (user able to select from drop-down of available devices) 
        c - (not in baseline version) player able to purchase additional 'terminal' i.e. run multiple devices

3. Repair Parts

4. Energy

5. Events 

6. Crypto-Coin Exchange

7. Validate Block

8. Mine Block

        a - game generates device and block keys (linked to active device probability range) 
        b - checks if match 
        c - if win calculate winnings
        d - calc round costs (i.e. active device power consumpation x power unit rate)
        e - calc subTotal (i.e. balance + winnings - cost)
        f - update balance

9. Game Stats and Achivements

10. Further Styling / Format Related


--------------------------------------------------------------------------------*/



/*---0.0 - Utilities-----------------------------------------------------*/




/*--import base game library--*/
/*import json--*/


/*--- 0.2 - Global Variables -----------------------------------------------------*/

/*--- 1 New Game (inclduing Game Mode Types and Reset) -----------------------------------------------------*/

/*---------------------------------------------------------------------------------
//  1.1 Prepare Game On DOM Load;
//      Wait until DOM loaded then obtain miner details from 'liveGameData' (default only available at start)
//      Data used to populate the HTML fields (dropdown menu, and performance stats)
//-------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function() {

    console.log("Stage 1: DOM load complete");
    newGame();
});


/*--- 1.1 - Game data tables -----------------------------------------------------*/
let liveGameData = {
    validationDevice: {
        difficulty: "",
        joinPool: "",
        memberTier: "",
        upgradeRequirements: "",
        upgradeProgress: ""
    },
    rig: {
        name: "Comm-Atari-ZX",
        cost: 0,
        multiCore: "N",
        baseChance: 1,
        baseHash: 1,
        basePower: 1,
        baseCondition: 20,
        rigComments: "Self-built from re-purposed parts from 1980's tech - hey, it's free?!"
    },
    parts: [{
        processor: {
            name: "A&D Zipper",
            cost: 0,
            chanceBuff: 0.1,
            hashPowerBuff: 0.1,
            powerBuff: 0.25,
            conditionBuff: 0
        },
        coolingSystem: {
            name: "deskfan",
            cost: 0,
            chanceBuff: 0,
            hashPowerBuff: 0,
            powerBuff: 0,
            conditionBuff: 0.05
        },
        operatingSystem: {
            name: "Simply Open Source",
            cost: 0,
            chanceBuff: 0,
            hashPowerBuff: 0,
            powerBuff: 0,
            conditionBuff: 2
        }
    }],
    finance: {
        bankBalance: 500,
        ewalletBalance: 0,
        fxRate: 100
    },
    energy: {
        provider: "Please Select An Energy Provider",
        type: "",
        costPerKw: "",
        reliability: "",
        pollutionRating: "",
        comments: ""
    },
    messages: {
        /*---TBC--*/
    },
    stats: {
        /*---TBC--*/
    },
    awards: {
        /*---TBC--*/
    }
};

/*-- temp stats is used to capture temp pos / neg effects from events --*/

let tempStats = {
    chanceTemp: 0,
    hashPowerTemp: 0,
    pwrUsageTemp: 0,
    conditionTemp: 0
};

/*--totalActiveStats is used to calculate the combined ratings of the base + parts + temp impacts --*/

let totalActiveStats = {
    totalChance: 0,
    totalHash: 0,
    totalPower: 0,
    totalCondition: 0
};

console.log("chance", liveGameData.rig.baseChance);
console.log("hash", liveGameData.rig.baseHash);
console.log("power", liveGameData.rig.basePower);
console.log("condition", liveGameData.rig.baseCondition);


/*-- 1.2 -- Temporary Stats (the temp stats table is used to capture short-term pos / neg impacts to performace typically as a result of events) --*/



/*--- 1.3 - Load Base Game data and update initial values on html page (note: some values are updated via a seperate function as this is re-used outside of the 'new game'stage ----------------------------------------------------*/

function newGame() {
    console.log("Stage 2: running newGame function");
    let miner = liveGameData['rig'];
    let parts = liveGameData['parts'];

    let minerRig = miner.name;
    $("#rig-name").text(minerRig);

    let minerProcessor = parts[0].processor.name;
    $("#processor-name").text(minerProcessor);

    let minerCoolSys = parts[0].coolingSystem.name;
    $("#cooling-name").text(minerCoolSys);

    let minerOpSys = parts[0].operatingSystem.name;
    $("#software-name").text(minerOpSys);
    console.log("Stage 3: base miner loaded");


    calcTotalActiveStats();

}

/*-- 1.4 -- Calc Total Stats & update html (calcs base stat x buff / nerf multipliers (i.e. impacts of parts and temp event effects) --*/




function calcTotalActiveStats() {

    let total = totalActiveStats;
    let base = liveGameData['rig'];
    let proBuff = liveGameData.parts[0].processor;
    let coolBuff = liveGameData.parts[0].coolingSystem;
    let osBuff = liveGameData.parts[0].operatingSystem;
    let temp = tempStats;

    total.totalChance = base.baseChance + (base.baseChance * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp));
    $("#chance-value").text(total.totalChance);
    total.totalHash = base.baseHash + (base.baseHash * (proBuff.hashPowerBuff + coolBuff.hashPowerBuff + osBuff.hashPowerBuff + temp.hashPowerTemp));
    $("#speed-value").text(total.totalHash);
    total.totalPower = base.basePower + (base.basePower * (proBuff.powerBuff + coolBuff.powerBuff + osBuff.powerBuff + temp.pwrUsageTemp));
    $("#power-value").text(total.totalPower);
    total.totalCondition = base.baseCondition + (base.baseCondition * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp));
    $("#condition-value").text(total.totalCondition);

    /*--temp console logging to remove from final version--*/
    console.log("base chance", base.baseChance);
    console.log("base hash", base.baseHash);
    console.log("base power", base.basePower);
    console.log("base condition", base.baseCondition);
    console.log("total chance", total.totalChance);
    console.log("total hash", total.totalHash);
    console.log("total power", total.totalPower);
    console.log("total condition", total.totalCondition);
    console.log("total data", total);

    refreshPerformanceBars();

};




/*--- 1.5 - Refresh Performance Bars  ---------------------------------------------------*/

function refreshPerformanceBars() {

};



/*--- 2. Upgrade Parts -----------------------------------------------------*/

/*--- 3. Repair Parts -----------------------------------------------------*/

/*--- 4. Energy -----------------------------------------------------*/

/*--- 5. Events -----------------------------------------------------*/

/*--- 6. Crypto-Coin Exchange -----------------------------------------------------*/

/*--- 7. Validate Block -----------------------------------------------------*/

/*--- 8. Mine Block -----------------------------------------------------
        a -  generate device and block keys (linked to active device probability range) 
        b - checks if match 
        c - if win calculate winnings
        d - calc round costs (i.e. active device power consumpation x power unit rate)
        e - calc subTotal (i.e. balance + winnings - cost)
        f - update balance -----------------------------------------------------*/

/*--- 9. Game Stats and Achivements -----------------------------------------------------*/