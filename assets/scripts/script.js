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
const liveGameData = {
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
            chanceBuff: 10, 
            hashPowerBuff: 10, 
            powerBuff: 25,
            conditionBuff: 0
        },
        coolingSystem: {
            name: "Deskfan",
            cost: 0,
            chanceBuff: 0,
            hashPowerBuff: 0,
            powerBuff: 0,
            conditionBuff: 5
        },
        operatingSystem: {
            name: "Simply Open Source",
            cost: 0,
            chanceBuff: 0,
            hashPowerBuff: 0,
            powerBuff: 0,
            conditionBuff: 25
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
        comments: "Good to the wallet, great reliability but awful to the environment. The choice for those who care for today and not for tomorrow"
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

/*-- 1.2 -- Temporary Stats (the temp stats table is used to capture short-term pos / neg impacts to performace typically as a result of events) --*/

const tempStats = {
    chanceTemp: 0,      //temp increase to increase speed during testing
    hashPowerTemp: 0,   //temp increase to increase speed during testing
    pwrUsageTemp: 0,
    conditionTemp: 0
};

/*--1.3 TotalActiveStats - calculates the combined ratings of the base + parts + temp impacts --*/

const totalActiveStats = {
    totalChance: 0,
    totalHash: 0,
    totalPower: 0,
    totalCondition: 0
};

console.log("chance", liveGameData.rig.baseChance);
console.log("hash", liveGameData.rig.baseHash);
console.log("power", liveGameData.rig.basePower);
console.log("condition", liveGameData.rig.baseCondition);



/*--- 1.4 - Load Base Game data and update initial values on html page (note: some values are updated via a seperate function as this is re-used outside of the 'new game'stage ----------------------------------------------------*/

function newGame() {
    console.log("Stage 2: running newGame function");
    const miner = liveGameData['rig'];
    const parts = liveGameData['parts'];
    const minerProcessor = parts[0].processor;
    const minerCoolSys = parts[0].coolingSystem;
    const minerOpSys = parts[0].operatingSystem;

    $("#rig-name").text(miner.name);
    $("#processor-name").text(minerProcessor.name);
    $("#cooling-name").text(minerCoolSys.name);
    $("#software-name").text(minerOpSys.name);
    console.log("Stage 3: base miner loaded");

    const energy = liveGameData['energy'];
    $("#provider-response").text(energy.provider);
    $("#type-response").text(energy.type);
    $("#cost-response").text(energy.usageCostPerKw);
    $("#reliability-response").text(energy.reliability);
    $("#pollution-rating-response").text(energy.pollutionRating);
    $("#statement").text(energy.comments);

    calcTotalActiveStats();

}

/*-- 1.5 -- Calc Total Stats & update html (calcs base stat x buff / nerf multipliers (i.e. impacts of parts and temp event effects) --*/


function calcTotalActiveStats() {

    const total = totalActiveStats;
    const base = liveGameData['rig'];
    const proBuff = liveGameData.parts[0].processor;
    const coolBuff = liveGameData.parts[0].coolingSystem;
    const osBuff = liveGameData.parts[0].operatingSystem;
    const temp = tempStats;

    total.totalChance = base.baseChance + (base.baseChance / 100 * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp));
    $("#chance-value").text(total.totalChance);
    total.totalHash = base.baseHash + (base.baseHash / 100 * (proBuff.hashPowerBuff + coolBuff.hashPowerBuff + osBuff.hashPowerBuff + temp.hashPowerTemp));
    $("#speed-value").text(total.totalHash);
    total.totalPower = base.basePower + (base.basePower / 100 * (proBuff.powerBuff + coolBuff.powerBuff + osBuff.powerBuff + temp.pwrUsageTemp));
    $("#power-value").text(total.totalPower);
    total.totalCondition = base.baseCondition + (base.baseCondition / 100 * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp));
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




/*--- 1.6 - Refresh Performance Bars  ---------------------------------------------------*/

function refreshPerformanceBars() {

    const maxValue = 100;
    const total = totalActiveStats;

    const chanceProgress = total.totalChance;
    const w = (chanceProgress / maxValue) * 100;
    console.log("chance Progress value", chanceProgress);
    console.log("chance Progress %", w);
    $("#chance-meter-bar").css("width", w + '%');

    const speedProgress = total.totalHash;
    const x = (speedProgress / maxValue) * 100;
    $("#speed-meter-bar").css("width", x + '%');

    const powerProgress = total.totalPower;
    const y = (powerProgress / maxValue) * 100;
    $("#power-meter-bar").css("width", y + '%');

    const conditionProgress = total.totalCondition;
    const z = (conditionProgress / maxValue) * 100;
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

//called from 'on-click' added inline to miner play button (html)

$("#terminal-miner-activatebtn").click(function() {
    //variables hoisted to enable usage across play functions//



    /*-- Step A - Run pre-game checks -----OUTSTANDING!!! - Consider adding checks which must pass prior to being able to run game//

    /*-- list of items to check;

                    Finances
                    - balance not negative (must be able to afford electricity costs. Redirect to block validation and / or exchange crypto-coin)

                    Miner
                    - status not Paused (event-in play) /  Disabled (repair needed or due to event)
                    - miner selected 

                    Energy
                    - provider selected--*/


    //-- Step B - function to set range of all keys with volume reduced to reflect 'chance'---*/
    console.log("mine block initiated");

    //runs function to ensure all changes to miner including performnce buffs / events are reflected
    calcTotalActiveStats();

    //set probability ceiling 
    const probability = totalActiveStats.totalChance / 100; //to convert to percentage
    const maxValue = 1000;
    const keyRange = maxValue - (maxValue * probability); //reduces the maxValue according to the total 'chance' rating
    console.log("probability", probability);
    console.log("maxValue", maxValue);
    console.log("keyRange", keyRange);

    //create array with all values within the keyRange - purpose is to cross referrence after minerKey checked and prevent re-selecting the same ID
    let keyStart = 1;
    let keyMax = keyRange;
    let allKeys = [];

    while (keyStart <= keyMax) {
        allKeys.push(keyStart++);
    }
    console.log("allKeys:", allKeys);

    //--Step C - generate blockKey which is limited to the pre-defined keyRange
    let blockKey = 0;
    generateBlockKey(blockKey);

    function generateBlockKey() {
        blockKey = Math.floor(Math.random() * keyRange) + 1;
        if (blockKey > keyRange) {
            alert("Error: BlockKey is out of range, please re-click to mine block!");
            console.log("blockKey:", blockKey);
        } else {
            console.log("blockKey:", blockKey);
        };
        return blockKey;
    };

    //--Step D - generate minerKey which is limited to the pre-defined keyRange
    let minerKey = 0;


    function generateMinerKey() {
        minerKey = Math.floor(Math.random() * keyRange) + 1;
        if (minerKey > keyRange) {
            alert("Error: MinerKey is out of range, please re-click to mine block!");
            console.log("minerKey:", minerKey);
        } else {
            console.log("minerKey:", minerKey);
        };
        return minerKey;
    };

    //--Step E - display modal and populate semi 'static' fields (semi static, meaning they do not change during the individual game round, but can display different values in other game rounds depending on user actions)

    $('#modal-mine-block').modal('show'); // display modal
    $('#modal-block-mining-response1').text(liveGameData.rig.name);
    $('#modal-block-mining-response2').text(keyRange);
    $('#modal-block-mining-response3').html(0); //Resets number of completed attempts to 0


    //--Step F - 'run' programme (within same modal) covers time (10 second cycle less hashSpeed buffs), displays animation whilst running, returns text to indicate when cycle complete, runs match (block vs. miner keys) and animation whilst cycle in play

    //Cycle timer : length = 10secs (10,000millisecs) less % hash speed bonus
    let hashSpeed = totalActiveStats.totalHash / 100; //to convert to percentage;
    console.log("hashspeed", hashSpeed);
    let maxCounter = 10; // maximum (unbuffed) speed of 10secs to mine block
    let buffedSpeed = maxCounter - (maxCounter * hashSpeed) //reduces the maxValue according to the total hashSpeed buff
    console.log("buffedSpeed", buffedSpeed);



    let count = document.getElementById('modal-block-mining-response3').innerHTML; //increment count of attempts


    gameCycle();

    function gameCycle() {

        $('#repeat-mine-btn').css('visibility', 'hidden'); //re-hides button to prevent repeated clicks before cycle completes
        generateMinerKey(minerKey);
        var timeleft = buffedSpeed;
        $('#modal-block-mining-response4').text("");
        $('#modal-block-mining-line5').css('visibility', 'hidden');
        $('#modal-block-mining-response5').css('visibility', 'hidden');
        var timer = setInterval(function() {
            if (timeleft <= 0) {
                clearInterval(timer);
                $('#modal-block-mining-response4').text("Check Completed");
                $('#modal-block-mining-img').css('visibility', 'hidden'); //hide animation
                $('#modal-block-mining-line5').css('visibility', 'visible');
                $('#modal-block-mining-response5').css('visibility', 'visible'); //display result line

                console.log("count=", count); //increment attempt count
                ++count;
                console.log("count=", count);
                $('#modal-block-mining-response3').html(count);
                console.log("count=", count);

                checkResult(minerKey, blockKey);

            } else {
                console.log(timeleft);
                $('#modal-block-mining-response4').text("Check in Operation");
                $('#modal-block-mining-img').css('visibility', 'visible');
            }
            timeleft -= 1;
        }, 1000);
    };

    let outcome = "";

    function checkResult(minerKey, blockKey) {
        console.log("minerKey vs blockKey", minerKey, "v", blockKey);
        if (minerKey === blockKey) {

            $('#modal-block-mining-response5').text('Key Accepted - Congratulations, block mined!'); // displays message confirming success
            $('#repeat-mine-btn').css('visibility', 'hidden'); //re-hides button to prevent running again
            $('#mine-success-img').css('display', 'block'); //reveal success image
            $('#exit-success-mine-btn').css('display', 'block'); //show success exit button
            $('#mine-block-exit-btn').css('visibility', 'hidden');
            $('#mine-block-exit-footnote').css('visibility', 'hidden');

            // add coin to ewallet balance
            let newCoinBalance = document.getElementById('ewallet-value').innerHTML;
            ++newCoinBalance;
            $('#ewallet-value').html(newCoinBalance);
            console.log("newCoinBalance", newCoinBalance);

            //adds 1 to stats 'blocks mined'           
            let newBlockMined = document.getElementById('stats-3-txt').innerHTML;
            ++newBlockMined;
            $('#stats-3-txt').html(newBlockMined);
            console.log("newBlockMined", newBlockMined);

            outcome = "win";
            return outcome;
            // run end of cycle function to update ewallet, calc and deduct energy costs, update game stats (blocks mined / keys checked, success rate, coins mined), miner performance (deterioration)

        } else {
            $('#modal-block-mining-response5').text('Key Not Accepted');
            $('#repeat-mine-btn').css('visibility', 'visible'); //display button to run again (note, btn rehidden after next cycle commences to prevent multi-clicks / attempts)

        };

    }



    $("#mine-block-exit-btn").click(function() {
        $('#modal-mine-block').modal('hide');
        calcResult();

    });

    $('#exit-success-mine-btn').click(function() {
        $('#mine-success-img').css('display', 'none');
        $('#exit-success-mine-btn').css('display', 'none');
        $('#modal-mine-block').modal('hide');
        $('#mine-block-exit-btn').css('visibility', 'visible');
        $('#mine-block-exit-footnote').css('visibility', 'visible');
        calcResult();
    })


    function calcResult() {

        //calc and deduct power usage
        //calc and update stats

        if (outcome = "win") {

        };
        console.log("calcResult complete");
    };


    $("#repeat-mine-btn").click(function() {
        gameCycle();

    });

});













/*create empty / temp array which can be referrenced by multiple functions to save repeating code

    let tempArray = ["*", "*", "*", "*", "*"];
    console.log("prior to running generate keys function", tempArray);

    // create bank of characters to limit max. combinations to 1,000
    // (special char) x 5 (alpha) x 4 (digit) x 2 (special char) x 5 (alpha) - version 2 also results in 1000 combos but restriction on individual char range allows for longer key (5 vs 3 in version 1)


    function generateTempKeys() {
        const key1 = ["$", "#", "-", "!", "@"];
        const key2 = ["A", "E", "I", "O", "U"];
        const key3 = ["$", "#", "-", "!", "@"];
        const key4 = ["0", "1"];
        const key5 = ["V", "W", "X", "Y", "Z"];

        //create empty / temp array and populate with 5 entries each being random selection per key position

        tempArray[0] = key1[Math.floor(Math.random() * key1.length)];
        tempArray[1] = key2[Math.floor(Math.random() * key2.length)];
        tempArray[2] = key3[Math.floor(Math.random() * key3.length)];
        tempArray[3] = key4[Math.floor(Math.random() * key4.length)];
        tempArray[4] = key5[Math.floor(Math.random() * key5.length)];
        //temporary logging of output
        console.log("inside generateTempKeys function", tempArray);
    }

    

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


};










// 'Temporary' data arrays created for the lifespan of a single game round. These are hoisted to a level within the over-arching game cycle function so that they can be fed into and feed out to other stages within the round's gameplay, but also not need to be 'reset' as they would if they resided at a global level

/*--

let outCome;
let outComeTxt;
let newBalance;
let roundCoin;
let newBitCoins;
let activeTarget;


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


            original functions
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



            });--*/







/*--- 9. Game Stats and Achivements -----------------------------------------------------*/