/jshint esversion:8, jquery:true/
/*--- Key Steps & Sequence -----------------------------------------------------//
0.0 - Utilities (temp to be removed!!)
0.1 - Global variables initiated
0.2 - Game data tables / library created
    - mainDataLibrary (all game data)
    - LiveGameData (populated with default data and pulls from mainData library as game progresses)

1. On Load - miner table loads with default starter device and balance 

2a. Activate Miner

2b. Upgrade device;
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
//  0.0 Utilities - 
//-------------------------------------------------------------------------------*/

// show / hide toggle event for How To Play and BitCoin 101

$(".show-pane").click(function() {
    $(this).siblings(".inner-content1").slideToggle('fade');
});


/*---------------------------------------------------------------------------------
//   0.1 - Global variables
//  Variables 'hoisted' to global for visibility across functions - refer with mentor if correct approach??
//-------------------------------------------------------------------------------*/


/*-------

let minerChance = parseInt(document.getElementById('miner-chance').innerText);
let minerPowerConsumption = parseInt(document.getElementById('miner-consumption').innerText);
let powerRate = parseInt(document.getElementById('power-rate').innerText);
console.log("1. onload minerChance =", minerChance);                                            //development only - to be removed

console.log("2. onload powerUsage =", minerPowerConsumption);                                   //development only - to be removed

console.log("3. onload powerRate =", powerRate);                                                //development only - to be removed


let blockSuccess;
-------*/

/*---------------------------------------------------------------------------------
//   0.2 - Game data tables / library; 
        i - mainDataLibrary are hard-coded and represent starting attributes
        ii - liveGameData is initiated from main data but adjusts to respond to player's decisions (e.g. when terminal activated, upgrades purchased, etc)
        iii -  additional 'short term' data arrays constructed (fed from liveGameData) which drive round by round calculations
//-------------------------------------------------------------------------------*/

let mainDataLibrary = {
    miningDevices: [{
            device: 'Terminal #1',
            purchaseCost: 0,
            chance: 50,
            speed: 1,
            consumption: 5,
            processor: 1,
            status: 0
        },
        {
            device: 'Terminal #2',
            purchaseCost: 10000,
            chance: 40,
            speed: 10,
            consumption: 15,
            processor: 80,
            status: 0
        },
        {
            device: 'Terminal #3',
            purchaseCost: 1000000,
            chance: 25,
            speed: 30,
            consumption: 500,
            processor: 70,
            status: 0
        }
    ],
    finance: [
        { bankBalance: 200 }
    ],
    power: [{
            provider: 'Renewable Energy Co.',
            costPerKw: '1',
            reliability: '6',
            toxicity: '2'
        },
        {
            provider: 'GAZMORE Inc.',
            costPerKw: '10',
            reliability: '9',
            toxicity: '8'
        }
    ]
};

//upon player purchasing terminal upgrades, data from the main table will be passed to the 'live' version which becomes the source data for the player to use (i.e. can't 'use' a device which has not been purchased). it also means retaining a devices original stats should future development enable short term changes to the live data (e.g. temporary performance boost);

let liveGameData = {
    availableMiners: [
        {}
    ],
    finance: [
        { bankBalance: 200 }
    ],
    power: [{
            provider: 'Renewable Energy Co.',
            costPerKw: '1',
            reliability: '6',
            toxicity: '2'
        },
        {
            provider: 'GAZMORE Inc.',
            costPerKw: '10',
            reliability: '9',
            toxicity: '8'
        }
    ]
};





/*---------------------------------------------------------------------------------
//  1.0 Prepare Game On DOM Load;
//      Wait until DOM loaded then obtain miner details from 'liveGameData' (default only available at start)
//      Data used to populate the HTML fields (dropdown menu, and performance stats)
//-------------------------------------------------------------------------------*/


document.addEventListener("DOMContentLoaded", function() { // Waits for the DOM to load before executing the initial game prep

    console.log("1.DOM load complete"); // end of onload function
});

//update miner stats 'in-play' after selection of device (function can be accessed at any time outside of 'mine block'game cycle)



/*---------------------------------------------------------------------------------
//   2a. Activate Miner; (player activates via modal handled by Bootstrap modal)
        i - device status changed (switch status icon / color, change panel classes to apply 'on' styles)run series of queries to update visual styling to indicate miner active including enabling / disabling of buttons
        ii - activate terminal buttons (upgrade / play) by removing disabled status
        ii - enable 'activate terminal for next terminal) - only applic to terminals 1 and 2
        NOTE - Code blocks for points i and ii are specific to the miner from which the event was triggered and are wrapped up in a if else statement to direct to the appropriate action
        Whilst the following steps are not specific to the miner which triggered the event so single instance of the functions / methods are required;
        
        iii - pull miner data from the master data table into the version created for the game
        iv - update player dashboard with the activated terminal stats
        v - update player balance with cost of unlocking terminal 
       
//-------------------------------------------------------------------------------*/

let term1 = document.getElementById("terminal1");
let term2 = document.getElementById("terminal2");
let term3 = document.getElementById("terminal3");

let actBtn1 = "btn-activation1";
let actBtn2 = "btn-activation2";
let actBtn3 = "btn-activation3";

$(".activate-miner").click(function() {

    console.log("2. terminal activated, id=", this.id);


    let activeBtn = this.id; //how to travese the dom from a modal button to the source?
    console.log(activeBtn);

    if (activeBtn === actBtn1) {
        console.log("3a. terminal1 activated");
        //terminal 1 actions go here

        //update this. terminals .card .styled-pane-card-off to on
        $("#term1-card").removeClass('styled-pane-card-off').addClass('styled-pane-card-on');

        //update this. terminals styled-pane-card-off to on (x 12)
        $("#term1-card").find('.styled-small-off').addClass('styled-small-on').removeClass('styled-small-off');
        $("#term1-card").find('.box').css("background-color", "var(--ink6-LED2LOW)");

        //update this. terminals status icon to on 
        $("#term1-card").find('.bi-toggle-off').addClass('bi-toggle-on').removeClass('bi-toggle-off');

        //update this. terminals btns to btn-on (upgrade & start) and btn-off (disable) activate  - BUG disable status only affects styling, need to add further action to prevent usage
        $("#term1-card").find('.primary').removeClass('btn-off primary').addClass('btn-on btn-primary').prop("disabled", false);
        $("#term1-card").find('.success').removeClass('btn-off success').addClass('btn-on btn-success').prop("disabled", false);
        $("#btn-to-modal-actv1").removeClass('btn-on btn-warning').addClass('btn-off').prop("disabled", true);
        //BUG FIX to prevent re-enacting for the same terminal or skipping to another terminal 
        //remove this terminals activebtn ID and apply ID to terminal 2   
        $("#btn-to-modal-actv1").attr('data-bs-target', '#');
        $("#btn-to-modal-actv2").attr('data-bs-target', '#modal-activate-miner2');

        //switch activation btn on for next terminal 
        $("#btn-to-modal-actv2").removeClass('btn-off warning').prop("disabled", false).addClass('btn-on btn-warning');

        //run function to feed base data from static mainDataLibrary to liveGameData (fluid version which adjusts according to player actions). 

        loadMiner();

        refreshDataT1();



        //run function to update miner attribute values displayed on screen

        //refreshPlayerDashboard();

        //update balance function

        //updateBalanceAfterPurchase(); 

        // repeat activation sequence for terminals 2 & 3

    } else if (activeBtn === actBtn2) {
        console.log("3b. terminal2 activated");


        $("#term2-card").removeClass('styled-pane-card-off').addClass('styled-pane-card-on');
        $("#term2-card").find('.styled-small-off').addClass('styled-small-on').removeClass('styled-small-off');
        $("#term2-card").find('.box').css("background-color", "var(--ink6-LED2LOW)");
        $("#term2-card").find('.bi-toggle-off').addClass('bi-toggle-on').removeClass('bi-toggle-off');
        $("#term2-card").find('.primary').removeClass('btn-off primary').addClass('btn-on btn-primary').prop("disabled", false);
        $("#term2-card").find('.success').removeClass('btn-off success').addClass('btn-on btn-success').prop("disabled", false);
        $("#btn-to-modal-actv2").removeClass('btn-on btn-warning').addClass('btn-off').prop("disabled", true);
        $("#btn-to-modal-actv2").attr('data-bs-target', '#');
        $("#btn-to-modal-actv3").attr('data-bs-target', '#modal-activate-miner3');
        $("#btn-to-modal-actv3").removeClass('btn-off warning').prop("disabled", false).addClass('btn-on btn-warning');

        loadMiner();

        refreshDataT2();

        updateBalance();

    } else if (activeBtn === actBtn3) {
        console.log("3c. terminal3 activated");


        $("#term3-card").removeClass('styled-pane-card-off').addClass('styled-pane-card-on');
        $("#term3-card").find('.styled-small-off').addClass('styled-small-on').removeClass('styled-small-off');
        $("#term3-card").find('.box').css("background-color", "var(--ink6-LED2LOW)");
        $("#term3-card").find('.bi-toggle-off').addClass('bi-toggle-on').removeClass('bi-toggle-off');
        $("#term3-card").find('.primary').removeClass('btn-off primary').addClass('btn-on btn-primary').prop("disabled", false);
        $("#term3-card").find('.success').removeClass('btn-off success').addClass('btn-on btn-success').prop("disabled", false);
        $("#btn-to-modal-actv3").removeClass('btn-on btn-warning').addClass('btn-off').prop("disabled", true);
        $("#btn-to-modal-actv3").attr('data-bs-target', '#');

        loadMiner();

        refreshDataT3();

        updateBalance();

    } else {
        alert("Oops, something's gone wrong! Error : activating terminal");
        console.log("3d. alert unrecognised id mapping");
    };

    //run function to feed base data from static mainDataLibrary to liveGameData (fluid version which adjusts according to player actions). 

    function loadMiner(loadMiner) { //loadMiner added in brackets to act as 'call-back' so that this is only run after the above sequence has completed

        let findTerminal = 0;

        if (activeBtn === actBtn1) {
            findTerminal = "Terminal #1";
            console.log(findTerminal, "found.4a")
        } else if (activeBtn === actBtn2) {
            findTerminal = "Terminal #2";
            console.log(findTerminal, "found.4b")
        } else if (activeBtn === actBtn3) {
            findTerminal = "Terminal #3";
            console.log(findTerminal, "found.4c")
        } else {
            alert("Oops, something's gone wrong! Error : refreshing terminal stats");
            console.log("4d. alert unrecognised id mapping");
        };

        let item = { device: findTerminal };

        let matchingItem = mainDataLibrary['miningDevices'].filter((obj) => {

            if (obj.device === item.device) {

                return true

            }
            return false;
        })

        let newStats = {
            device: (matchingItem[0].device),
            purchaseCost: (matchingItem[0].purchaseCost), //note: purchase cost is not fed back to HTML directly, but used in subsequent upgrade balance calc
            consumption: (matchingItem[0].consumption),
            chance: (matchingItem[0].chance),
            speed: (matchingItem[0].speed),
            reliability: (matchingItem[0].reliability),
            status: (matchingItem[0].status),
        }


        liveGameData['availableMiners'].push(newStats);
        console.log("5 liveGameData", liveGameData);

    }

    function refreshDataT1(refreshDataT1) {
        console.log(refreshDataT1, "6a. started");
        let t = liveGameData['availableMiners'];
        let t1Chance = t[1].chance;
        $("#T1chance").text(t1Chance);

        let t1Speed = t[1].speed;
        $("#T1speed").text(t1Speed);

        let t1Consump = t[1].consumption;
        $("#T1consump").text(t1Consump);

        let t1reliab = t[1].reliability;
        $("#T1reliability").text(t1reliab);
    }


    function refreshDataT2(refreshDataT2) {
        console.log(refreshDataT2, "6b. started");
        let t = liveGameData['availableMiners'];
        let t2Chance = t[2].chance;
        $("#T2chance").text(t2Chance);


        let t2Speed = t[2].speed;
        $("#T2speed").text(t2Speed);

        let t2Consump = t[2].consumption;
        $("#T2consump").text(t2Consump);

        let t2reliab = t[2].reliability;
        $("#T2reliability").text(t2reliab);
    }

    function refreshDataT3(refreshDataT3) {
        console.log(refreshDataT3, "6c. started");
        let t = liveGameData['availableMiners'];
        let t3Chance = t[3].chance;
        $("#T3chance").text(t3Chance);

        let t3Speed = t[3].speed;
        $("#T3speed").text(t3Speed);

        let t3Consump = t[3].consumption;
        $("#T3consump").text(t3Consump);

        let t3reliab = t[3].reliability;
        $("#T3reliability").text(t3reliab);
    }

    //update balance function - starter balance loaded in HTML by default & no initial unlock cost (i.e. no action for T1 activation) but debits balance (purchase cost) for T2 and T3
    updateBalance();

    function updateBalance(updateBalance) {

        let currentBal = liveGameData.finance[0].bankBalance;

        if (activeBtn === actBtn2) {
            let unlockCost = liveGameData['availableMiners'][2].purchaseCost;
            console.log("7a.unlock cost", unlockCost);
            console.log("8a current bal", currentBal);
            let newBal = currentBal - unlockCost;
            console.log("9a.new bal", newBal);
            liveGameData['finance'].bankBalance = newBal;
            $("#GBP-balance-current").text(newBal);
            console.log("10.a bank balance", liveGameData['finance'].bankBalance);

        } else if (activeBtn === actBtn3) {
            let unlockCost = liveGameData['availableMiners'][3].purchaseCost;
            console.log("7b.unlock cost", unlockCost);
            console.log("8b current bal", currentBal);
            let newBal = currentBal - unlockCost;
            console.log("9b.new bal", newBal);
            liveGameData['finance'].bankBalance = newBal;
            $("#GBP-balance-current").text(newBal);
            console.log("10.b bank balance", liveGameData['finance'].bankBalance);

        }
    }
});




/*---------------------------------------------------------------------------------
//   2b. Upgrade device;
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
//   3. Power Provider  (not in baseline) changes to power source / cost rate 
//-------------------------------------------------------------------------------*/



/*---------------------------------------------------------------------------------
//   4. Run Game (event = player clicks to run new round);
        - pre-check to ensure power supplier slected (alert blocks play wihtout selection)
        a - game generates device and block keys (linked to active device probability range) 
        b - checks if match 
        c - calc outcome,subTotal (last balance + winnings - costs); 
            i) associated power costs (power consumpation x power unit rate)
            ii) winnings (if keys match)
        d - update current balance (last balance + round subTotal)
//-------------------------------------------------------------------------------*/

// Run Game - Event listener for run game button (initiate game cycle stages)

let gameData = new Array(); // 'Temporary' data arrays created for the lifespan of a single game round. These are hoisted to a level within the over-arching game cycle function so that they can be fed into and feed out to other stages within the round's gameplay, but also not need to be 'reset' as they would if they resided at a global level 
let gamePowerData = new Array();
let termKeyId;
let blockId;
let outCome;
let outComeTxt;
let newBalance;
let roundCoin;
let newBitCoins;
let activeTarget;

let play = document.getElementsByClassName('btn-play');

$(".btn-play").click(function() {

    let terminalInPlay = this.id; // captured up front after button selection and held for use after power data compiled

    //check performed to ensure power provider selected - at same time, related power stats pulled for the game cycle

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




















/*---------------------------------------------------------------------------------
//   5. Events (not in baseline)
//-------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------
//   6. X-change (not in baseline)
//-------------------------------------------------------------------------------*/