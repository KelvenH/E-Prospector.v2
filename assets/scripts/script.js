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
            name: "Deskfan",
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
        provider: "Gas-tricity",
        upfrontCost: 0,
        type: "Fossil Fuel",
        usageCostPerKw: 0.25,
        reliability: "Great",
        pollutionRating: "C",
        comments: "Good to the wallet, great reliability but awful to the environment. The choice for those who care for today and not tomorrow"
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
    let minerProcessor = parts[0].processor;
    let minerCoolSys = parts[0].coolingSystem;
    let minerOpSys = parts[0].operatingSystem;

    $("#rig-name").text(miner.name);
    $("#processor-name").text(minerProcessor.name);
    $("#cooling-name").text(minerCoolSys.name);
    $("#software-name").text(minerOpSys.name);
    console.log("Stage 3: base miner loaded");

    let energy = liveGameData['energy'];
    $("#provider-response").text(energy.provider);
    $("#type-response").text(energy.type);
    $("#cost-response").text(energy.usageCostPerKw);
    $("#reliability-response").text(energy.reliability);
    $("#pollution-rating-response").text(energy.pollutionRating);
    $("#statement").text(energy.comments);

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

    let maxValue = 1000;
    let total = totalActiveStats;

    let chanceProgress = total.totalChance;
    let w = (chanceProgress / maxValue) * 100;
    console.log("chance Progress value", chanceProgress);
    console.log("chance Progress %", w);
    $("#chance-meter-bar").css("width", w + '%');

    let speedProgress = total.totalHash;
    let x = (speedProgress / maxValue) * 100;
    $("#speed-meter-bar").css("width", x + '%');

    let powerProgress = total.totalPower;
    let y = (powerProgress / maxValue) * 100;
    $("#power-meter-bar").css("width", y + '%');

    let conditionProgress = total.totalCondition;
    let z = (conditionProgress / maxValue) * 100;
    $("#condition-meter-bar").css("width", z + '%');
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

/*-- Step A - generate miner and block keys ---*/

// 'Temporary' data arrays created for the lifespan of a single game round. These are hoisted to a level within the over-arching game cycle function so that they can be fed into and feed out to other stages within the round's gameplay, but also not need to be 'reset' as they would if they resided at a global level 

let gameData = new Array();
let gamePowerData = new Array();
let termKeyId;
let blockId;
let outCome;
let outComeTxt;
let newBalance;
let roundCoin;
let newBitCoins;
let activeTarget;

let play = document.getElementById("#terminal-miner-activatebtn");

$(".terminal-miner-activatebtn").click(function() {

    //initials checks must pass all prior to being able to proceed//

    /*-- list of items to check;

        Finances
        - balance not negative (must be able to afford electricity costs. Redirect to block validation and / or exchange crypto-coin)

        Miner
        - status not Paused (event-in play) /  Disabled (repair needed or due to event)
        - miner selected 

        Energy
        - provider selected
    --*/



    console.log("11. terminal started mining, id=", this.id);

    let chosenProvider;

    checkPowerSupplied();

    function checkPowerSupplied(checkPowerSupplied) {

        if (document.getElementById('renewable').checked) {
            chosenProvider = 'Renewable Energy Co.';

        } else if (document.getElementById('gazmore').checked) {
            chosenProvider = 'GAZMORE Inc.';
        } else {
            alert("Please select your choice of power provider - no power = no play!")
        }
    }



    calcGamePowerData();

    function calcGamePowerData(calcGamePowerData) {

        console.log("13. supplier", chosenProvider);

        let suppliermatch = { provider: chosenProvider };

        let matchingPower = liveGameData['power'].filter((obj) => {

            if (obj.provider === suppliermatch.provider) {

                return true

            }
            return false;
        })

        gamePowerData = {
            provider: (matchingPower[0].provider),
            costPerKw: (matchingPower[0].costPerKw),
            reliability: (matchingPower[0].reliability),
            toxicity: (matchingPower[0].toxicity),
        }

        console.log("14.", gamePowerData);
    }


    calcGameTerminalData();

    function calcGameTerminalData(calcGameTerminalData) {

        let t1 = 'term1-play';
        let t2 = 'term2-play';
        let t3 = 'term3-play';
        console.log("15a.", t1);

        if (terminalInPlay === t1) {

            terminal = 'Terminal #1';
            activeTarget = document.getElementsByClassName('t1-act');

        } else if (terminalInPlay === t2) {

            terminal = 'Terminal #2';
            activeTarget = document.getElementsByClassName('t2-act');

        } else if (terminalInPlay === t3) {

            terminal = 'Terminal #3';
            activeTarget = document.getElementsByClassName('t3-act');

        } else {
            alert("Oops, something's gone wrong! Error : run game error");
            console.log("alert unrecognised terminal play mapping");
        };

        console.log(terminal);
        let item = { device: terminal };

        let matchingItem = liveGameData['availableMiners'].filter((obj) => {

            if (obj.device === item.device) {

                return true

            }
            return false;
        })


        gameData = {
            device: (matchingItem[0].device),
            consumption: (matchingItem[0].consumption),
            chance: (matchingItem[0].chance),
            speed: (matchingItem[0].speed),
            reliability: (matchingItem[0].reliability),
        }
        console.log("16", gameData);
    }

    generateTerminalKey();
    generateBlockID();
    result();



    function generateTerminalKey(generateTerminalKey) {

        let terminalprobability = gameData.chance;
        console.log("17. terminl prob", terminalprobability);

        let terminalkey = Math.floor(Math.random() * terminalprobability) + 1;
        termKeyId = terminalkey;
        console.log("18.termkey", terminalkey);
    };

    function generateBlockID(generateBlockID) {
        let terminalprobability = gameData.chance;
        let blockLock = Math.floor(Math.random() * terminalprobability) + 1;
        blockId = blockLock;
        console.log("19.blockID", blockId);
    };

    function result(result) {
        if (termKeyId === blockId) {
            outCome = 1;
            outComeTxt = 'Y';
            newBitCoins = parseInt(document.getElementById('bit-balance-current')) + 1;


        } else {
            outCome = 0;
            outComeTxt = 'N';
        }
        console.log("20.", outCome);
    }

    // Game Stage C - Calculate Outcome 

    calcSubTotal();

    function calcSubTotal(calcSubTotal) {
        let roundCost = gameData.consumption * gamePowerData.costPerKw;
        console.log("21. PowerConsumption", gameData.consumption);
        console.log("22. consumption", gamePowerData.costPerKw);
        console.log("23. RoundCost", roundCost);
        let oldBalance = parseInt(document.getElementById('GBP-balance-current').innerText);
        newBalance = oldBalance - roundCost;
        console.log("24. new balance", newBalance);

    }

    // Game stage D - Update DashBoard -time delay added into the write-back - relates to speed factor of terminal. Write-back held out to avoid issues with functions being performed for other devices. 

    let targetClass = activeTarget //add styling to indicate mining in progress
    $(targetClass).addClass('styled-active'); // bugs encountered if same / other terminal activated whilst a previous terminal is still operating. Additional logic applied to remove the ability to activate 'start miner' button until game cycle has fully completed.
    $(".btn-play").removeClass(".btn-play").addClass(".miner-paused");

    let i = 30000 / gameData.speed; //  max time delay of 30s divided by terminal (i.e. higher speed rating equals quicker outcome) 

    setTimeout(updateDashboard, i);
    console.log("25. timer started to run for", i)



    function updateDashboard() {
        $("#TermID").text(gameData.device);
        $("#TermKey").text(termKeyId);
        $("#BlockKey").text(blockId);
        $("#Result").text(outComeTxt);
        $("#bit-balance-current").text(newBitCoins);
        $("#GBP-balance-current").text(newBalance);
        console.log("round timer completed, dashboard updated")
        $(targetClass).removeClass('styled-active');
        $(".miner-paused").removeClass(".miner-paused").addClass(".btn-play");
    };



});







/*--- 9. Game Stats and Achivements -----------------------------------------------------*/