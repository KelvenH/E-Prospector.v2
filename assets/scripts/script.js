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
    miningDevice: {
        rig: "Comm-Atari-ZX",
        baseChance: 1,
        baseHash: 2,
        basePower: 3,
        baseCondition: 4,
        multiCore: "N"
    },
    parts: [{
        processor: {
            name: "A&D Zipper",
            cost: 0,
            chanceBuff: 0.1,
            hashBuff: 0.1,
            powerBuff: 0.25,
            conditionBuff: 0
        },
        coolingSystem: {
            name: "Deskfan",
            cost: 0,
            chanceBuff: 0.15,
            hashBuff: 0,
            powerBuff: 0,
            conditionBuff: 0.05
        },
        operatingSystem: {
            name: "Simply Open Source",
            cost: 0,
            chanceBuff: 0.2,
            hashBuff: 0,
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

/*-- 1.2 -- Temporary Stats (the temp stats table is used to capture short-term pos / neg impacts to performace typically as a result of events)--*/

let tempStats = {
    chanceBuff: 0.05,
    hashBuff: 0,
    pwrUsage: 0,
    condition: 0.5
};

/*-- 1.3 -- Miner Stats (calc the base stat x buff / nerf multipliers (from parts and temp event effects--*/

let totalActiveStats = {
    totalChance: 0,
    totalHash: 0,
    totalPower: 0,
    totalCondition: 0
};


/*--- 1.2 - Load Base Game data  -----------------------------------------------------*/

function newGame() {
    console.log("Stage 2: running newGame function");
    let miner = liveGameData['miningDevice'];
    let parts = liveGameData['parts'];

    let minerRig = miner.rig;
    $("#rig-name").text(minerRig);

    let minerProcessor = parts[0].processor.name;
    $("#processor-name").text(minerProcessor);

    let minerCoolSys = parts[0].coolingSystem.name;
    $("#cooling-name").text(minerCoolSys);

    let minerOpSys = parts[0].operatingSystem.name;
    $("#software-name").text(minerOpSys);
    console.log("Stage 3: base miner loaded");

    /*---refreshMinerStats();--*/
    calcTotalActiveStats();

}

/*--- 1.3 - Update Miner Perfprmance Stats (i.e. base stats + / - buffs / nerfs from parts and events)  -----------------------------------------------------*/

function calcTotalActiveStats() {

    let base = liveGameData['miningDevice'];
    let proBuff = liveGameData.parts[0].processor;
    let coolBuff = liveGameData.parts[0].coolingSystem;
    let osBuff = liveGameData.parts[0].operatingSystem;
    let tempBuff = tempStats;

    totalActiveStats.totalChance = base.baseChance += (base.baseChance *= (proBuff.chanceBuff += coolBuff.chanceBuff += osBuff.chanceBuff += tempBuff.chanceBuff));
    totalActiveStats.totalHash = base.baseHash += (base.baseHash *= (proBuff.hashBuff += coolBuff.hashBuff += osBuff.hashBuff += tempBuff.hashBuff));
    totalActiveStats.totalPower = base.basePower += (base.basePower *= (proBuff.powerBuff += coolBuff.powerBuff += osBuff.powerBuff += tempBuff.powerBuff));
    totalActiveStats.totalCondition = base.baseCondition += (base.baseCondition *= (proBuff.conditionBuff += coolBuff.conditionBuff += osBuff.conditionBuff += tempBuff.conditionBuff));


    console.log(base.baseChance);
    console.log(base.baseHash);
    console.log(base.basePower);
    console.log(base.baseCondition);


    $("#chance-value").text(totalActiveStats.totalChance);
    $("#speed-value").text(totalActiveStats.totalHash);
    $("#power-value").text(totalActiveStats.totalPower);
    $("#condition-value").text(totalActiveStats.totalCondition);
    console.log(totalActiveStats);
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