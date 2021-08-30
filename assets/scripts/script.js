/jshint esversion:8, jquery:true/

/*--- Key Steps & Sequencing -----------------------------------------------------/

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

//Full Game Library note: unable to import gamelibray as a local JSON file, so retained on main js file

const gameLibrary = {
    rigs: [{
        name: "Comm-Atari-ZX",
        cost: 0,
        multiCore: "N",
        baseChance: 1,
        baseHash: 1,
        basePower: 1,
        baseCondition: 20,
        rigComments: "Self-built from re-purposed parts from 1980's tech - hey, it's free?!"
    },
    {
        name: "Bell 200",
        cost: 100,
        multiCore: "N",
        baseChance: 2,
        baseHash: 2,
        basePower: 2,
        baseCondition: 22,
        rigComments: "Upgrade to twice the power (well, 2 x peanuts is still peanuts!)"
    },
    {
        name: "Macro-hard 350+",
        cost: 500,
        multiCore: "N",
        baseChance: 3,
        baseHash: 3,
        basePower: 3,
        baseCondition: 17,
        rigComments: "Not a popular choice - that's for a reason!"
    },
    {
        name: "Dwell Junior",
        cost: 1000,
        multiCore: "N",
        baseChance: 5,
        baseHash: 4,
        basePower: 5,
        baseCondition: 25,
        rigComments: "Once-upon-a-time this was considered a good machine ….once-upon-a-time"
    },
    {
        name: "Orange i-plop",
        cost: 1250,
        multiCore: "N",
        baseChance: 5,
        baseHash: 8,
        basePower: 7,
        baseCondition: 40,
        rigComments: "Unfortunate translation of the model name, but 8-core processor makes this a worthy early consideration"
    },
    {
        name: "Blackbox F-Series",
        cost: 1500,
        multiCore: "Y",
        baseChance: 15,
        baseHash: 4,
        basePower: 25,
        baseCondition: 15,
        rigComments: "Not one knows why, but there seems to be some secret magic with this thing…. when it's not on fire that is!"
    },
    {
        name: "Bell Runner S",
        cost: 2000,
        multiCore: "N",
        baseChance: 10,
        baseHash: 6,
        basePower: 25,
        baseCondition: 35,
        rigComments: "More mid-pack than race winner, but reasonable effort for the top end of the low budget series!"
    },
    {
        name: "Bell Runner S+",
        cost: 3000,
        multiCore: "N",
        baseChance: 10,
        baseHash: 6,
        basePower: 22,
        baseCondition: 35,
        rigComments: "Exactly the same machine, rolled out the following year with a shiny '+' added to the name tag… and a minor power saving"
    },
    {
        name: "Orange i-poop",
        cost: 4500,
        multiCore: "N",
        baseChance: 15,
        baseHash: 8,
        basePower: 25,
        baseCondition: 40,
        rigComments: "Ok, let's forget the model-name, performance exceeds its mid-budget price tag (and with the spare cash you can paint over the name!)"
    },
    {
        name: "Dwell Expert",
        cost: 6000,
        multiCore: "N",
        baseChance: 15,
        baseHash: 4,
        basePower: 20,
        baseCondition: 35,
        rigComments: "Sacrfices speed for power savings. Save the planet or make some money - this Expert thinks you can’t have it both ways."
    },
    {
        name: "Majic My-k",
        cost: 7500,
        multiCore: "N",
        baseChance: 20,
        baseHash: 10,
        basePower: 35,
        baseCondition: 35,
        rigComments: "The sales material reads 'Stripped back for raw, hardcore performance' (not my words, not my words!)"
    },
    {
        name: "Majic My-k Extreme",
        cost: 10000,
        multiCore: "N",
        baseChance: 20,
        baseHash: 15,
        basePower: 40,
        baseCondition: 35,
        rigComments: "Perhaps don’t go google searching this one, let’s just say it comes with a bit more beefed up power and speed."
    },
    {
        name: "Dwell Professional",
        cost: 20000,
        multiCore: "N",
        baseChance: 25,
        baseHash: 20,
        basePower: 40,
        baseCondition: 40,
        rigComments: "Solid machine, solid performance, solid condition…... a solid choice!"
    },
    {
        name: "Orange i-pop",
        cost: 50000,
        multiCore: "N",
        baseChance: 35,
        baseHash: 20,
        basePower: 50,
        baseCondition: -25,
        rigComments: "Ironically for the i-pop this one runs a dream….before well, she 'pops'! Rewards should cover the repairs and keep you in the black."
    },
    {
        name: "Coin - Ripper",
        cost: 70000,
        multiCore: "Y",
        baseChance: 50,
        baseHash: 50,
        basePower: 1500,
        baseCondition: 50,
        rigComments: "More expensive, but the cheapest of the terminals purpose built for crypto-mining. Things are getting serious now!"
    },
    {
        name: "Blackbox X-Series",
        cost: 100000,
        multiCore: "Y",
        baseChance: 60,
        baseHash: 50,
        basePower: 2000,
        baseCondition: 50,
        rigComments: "Blackbox are back again with an improved secret box….. it's black.… ad the rest, well its a secret!"
    },
    {
        name: "Terminus",
        cost: 200000,
        multiCore: "Y",
        baseChance: 75,
        baseHash: 65,
        basePower: 5000,
        baseCondition: 75,
        rigComments: "The top-end performer - and needs to be to pay off the running costs!"
        }
    ],
    parts: [{
        processor: [{
                name: "AND Zipper",
                cost: 0,
                chanceBuff: 10,
                hashPowerBuff: 10,
                powerBuff: 25,
                conditionBuff: 0
            },
            {
                name: "Eye-Bee-Em Silver",
                cost: 750,
                chanceBuff: 15,
                hashPowerBuff: 15,
                powerBuff: 50,
                conditionBuff: 0
            },
            {
                name: "Eye-Bee-Em Gold",
                cost: 900,
                chanceBuff: 20,
                hashPowerBuff: 50,
                powerBuff: 100,
                conditionBuff: 0
            },
            {
                name: "AND Zipper+",
                cost: 1250,
                chanceBuff: 20,
                hashPowerBuff: 100,
                powerBuff: 100,
                conditionBuff: 0
            },
            {
                name: "Eye-Bee-Em Platinum",
                cost: 1500,
                chanceBuff: 25,
                hashPowerBuff: 200,
                powerBuff: 200,
                conditionBuff: -25
            },
            {
                name: "Eye-Bee-Em Diamond",
                cost: 2000,
                chanceBuff: 30,
                hashPowerBuff: 30,
                powerBuff: 30,
                conditionBuff: -50
            },
            {
                name: "AND Zipper++",
                cost: 5000,
                chanceBuff: 35,
                hashPowerBuff: 35,
                powerBuff: 500,
                conditionBuff: -100
            }
        ],
        coolingSystem: [{
                name: "Deskfan",
                cost: 0,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 5
            },
            {
                name: "Fan-Fare Double Bladed Case Fan",
                cost: 1500,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 10
            },
            {
                name: "Oxy-Blast Master CPU Fan",
                cost: 2500,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 35
            },
            {
                name: "Wind-E MKI CPU Fan",
                cost: 5000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 40
            },
            {
                name: "Wind-E MKII Heatsink Fan",
                cost: 10000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 45
            },
            {
                name: "Fan-Fare Typhoon Heatsink and CPU Fan",
                cost: 20000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 50
            },
            {
                name: "Ice-Blaster Heatsink and CPU Fan",
                cost: 50000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 75
            },
            {
                name: "Liquid-ice Intergrated Cooling Tech",
                cost: 100000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 200
            }
        ],
        operatingSystem: [{
                name: "Simply Open Source",
                cost: 0,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 25
            },
            {
                name: "Macro-hard 15",
                cost: 2000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 50
            },
            {
                name: "Orange OS",
                cost: 4000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 75
            },
            {
                name: "Blackbox .IO",
                cost: 50000,
                chanceBuff: 0,
                hashPowerBuff: 0,
                powerBuff: 100,
                conditionBuff: 100
            }
        ]
    }],
    energy: [{
        provider: "Home Solar Panels",
        upfrontCost: 5000,
        type: "Renewable",
        usageCostPerKw: 0,
        reliability: "Poor",
        pollutionRating: "A",
        comments: "Be good to the planet, a one-off installation cost and then you're good to go….. unless the weather has a say!"
    },
    {
        provider: "Hay-Bred Dairy Yard",
        upfrontCost: 1000,
        type: "Renewable",
        usageCostPerKw: 0.5,
        reliability: "Average",
        pollutionRating: "B",
        comments: "This dairy farm has one hoof in the future. Simultaneous milking and manure liquidisation generates spare power for the local community. Not completely Co2 free option (you have smelt a farm right?)"
    },
    {
        provider: "Fossil-free UK Industries Tech",
        upfrontCost: 500,
        type: "Renewable",
        usageCostPerKw: 0.75,
        reliability: "Average",
        pollutionRating: "B",
        comments: "UK's leading renewable energy provider. The less than ideal geographical location means reliability can be patchy at best (then you may find yourself shouting the companies name)."
    },
    {
        provider: "Flower Power Ltd",
        upfrontCost: 250,
        type: "Renewable off-set",
        usageCostPerKw: 0.5,
        reliability: "Good",
        pollutionRating: "A",
        comments: "This hybrid power supplier sources energy primarily through renewable sources, but generates additional power through the disposal of waste. All Co2 emmissions are off-set through tree and planting programmes - to ensure these folks come out smelling of roses!"
    },
    {
        provider: "Gas-tricity",
        upfrontCost: 0,
        type: "Fossil Fuel",
        usageCostPerKw: 0.25,
        reliability: "Great",
        pollutionRating: "C",
        comments: "Good to the wallet, great reliability but awful to the environment. The choice for those who care for today and not tomorrow"
    }
]};

// Live Game Data - initiated with default starting data and ammended through game actions

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
            name: "AND Zipper",
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
        bankBalance: 1000,
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


// Purchase history - use to add purchases to avoid a repeated cost to switch to

const purchasedRigs = [];
const purchasedProcs = [];
const purchasedCoolSys = [];
const purchasedOpSys = [];


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
    // load default miner //
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

    // load default energy //
    const energy = liveGameData['energy'];
    $("#provider-response").text(energy.provider);
    $("#type-response").text(energy.type);
    $("#cost-response").text(energy.usageCostPerKw);
    $("#reliability-response").text(energy.reliability);
    $("#pollution-rating-response").text(energy.pollutionRating);
    $("#statement").text(energy.comments);

    // load default finance - note approach to update the second [1] value to prevent overwriting the span (£) //
    const finance = liveGameData['finance'];
    console.log("this should be the balance", finance.bankBalance);
    $("#bank-value").contents()[1].nodeValue = finance.bankBalance;
    

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

    /*--total.totalChance = base.baseChance + (base.baseChance / 100 * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp));--*/

    // caps result to 100 max
    
    let ChanceTotal = base.baseChance + (base.baseChance / 100 * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp));

    console.log("ChanceTotal", ChanceTotal);
  

    if (ChanceTotal > 100) {
        total.totalChance = 100
    } else {
        total.totalChance = ChanceTotal
    }
    $("#chance-value").text(total.totalChance);
    
    HashTotal = base.baseHash + (base.baseHash / 100 * (proBuff.hashPowerBuff + coolBuff.hashPowerBuff + osBuff.hashPowerBuff + temp.hashPowerTemp));
    if (HashTotal > 100) {
        total.totalHash = 100
    } else {
        total.totalHash = HashTotal
    }
    $("#speed-value").text(total.totalHash);
    
    //no cap on power usage
    total.totalPower = base.basePower + (base.basePower / 100 * (proBuff.powerBuff + coolBuff.powerBuff + osBuff.powerBuff + temp.pwrUsageTemp));
    $("#power-value").text(total.totalPower);
    
    ConditionTotal = base.baseCondition + (base.baseCondition / 100 * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp));
    if (ConditionTotal > 100) {
        total.totalCondition = 100
    } else {
        total.totalCondition = ConditionTotal
    }
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



/*--- 2. Upgrades  -----------------------------------------------------*/

$("#terminal-miner-upgradebtn").click(function() {
    $('#modal-upgrades').modal('show');
    
    /*--display rigs table --*/
    $("#upgrade-rigs-tab").click(function() {

        let rigs = gameLibrary['rigs'];
        console.log("rigs", rigs);

        let rigHtml = `
            <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Chance</th>
                            <th>Speed</th>
                            <th>Power</th>
                            <th>Condition</th>
                            <th>Notes</th>
                            <th>Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
        
        for (rig of rigs) {
            let rowHtml = `
                    <tr class="rig-row">
                        <td class="upgrade-rig-name">${rig.name}</td>
                        <td class="upgrade-rig-cost">${rig.cost}</td>
                        <td class="upgrade-rig-chance">${rig.baseChance}</td>
                        <td class="upgrade-rig-hash">${rig.baseHash}</td>
                        <td class="upgrade-rig-power">${rig.basePower}</td>
                        <td class="upgrade-rig-condition">${rig.baseCondition}</td>
                        <td class="upgrade-rig-comments">${rig.rigComments}</td>
                        <td><button class="purchase-button">Buy</button></td>
                    </tr>
                    `;
            rigHtml += rowHtml;
            }
            rigHtml += `
                    </tbody>
                </table>
            `;

        document.getElementById('rigs-table').innerHTML = rigHtml; 

        /*--check if rig already purchased, if yes remove button and replace with text --*/
        
        // feature outstanding


        /*--purchase rig --*/
        $(".purchase-button").click(function() {

            /*--create array to hold values associated to button's indirect siblings--*/

            let selectedRig = [];
            selectedRig = $(this).parent().siblings();
            console.log(selectedRig[0]);

            /*--create temp array to pull innerhtml values--*/
            let name = selectedRig[0].innerHTML;
            let cost = parseFloat(selectedRig[1].innerHTML);
            let chance = parseFloat(selectedRig[2].innerHTML);
            let hash = parseFloat(selectedRig[3].innerHTML);
            let power = parseFloat(selectedRig[4].innerHTML);
            let condition = parseFloat(selectedRig[5].innerHTML);
            let comments = selectedRig[6].innerHTML;
            
            
            /*--check able to afford, if able to afford run purchaseRig, else display message with current balance --*/

            let price = cost;
            console.log("price", price);

            let currentBal = liveGameData.finance.bankBalance;
            console.log("current Balance", currentBal);
            
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
                console.log("can't afford");

                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            }

            else {
                purchaseRig();
            };

            /*--function to purchase rig---*/

            function purchaseRig() {
            
                /*--update liveGameData with purchased rig details--*/
                liveGameData.rig.name = name;
                liveGameData.rig.cost = cost;
                liveGameData.rig.baseChance = chance;
                liveGameData.rig.baseHash = hash;
                liveGameData.rig.basePower = power;
                liveGameData.rig.baseCondition = condition;
                liveGameData.rig.rigComments = comments;
                
                /*--update rig name displayed on html. --*/
                $("#rig-name").text(liveGameData.rig.name);

                /*--add rig to list of purchased rigs --*/
                console.log("purchased rigs", purchasedRigs);
                purchasedRigs.push(name);
                console.log("purchased rigs", purchasedRigs);

                /*--deduct costs (calculate, update liveGameData and display to page)--*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                console.log(newBalance);

                /*--run Total Active Stats to update performance values and bars --*/
                calcTotalActiveStats();

                /*--redirect after purchase (close modal)--*/
                $('#modal-upgrades').modal('hide');
            } // end of purchase rig function

        }); // end of functions within purchase rig button

    });  // end of rig upgrades function

    
    /*--display processors table --*/

    $("#upgrade-processors-tab").click(function() {
        
        let processors = gameLibrary.parts[0].processor;
        console.log("processors", processors);

        let procHtml = `
            <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Chance Buff</th>
                            <th>Speed Buff</th>
                            <th>Power Buff</th>
                            <th>Condition Buff</th>
                            <th>Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
        
        for (proc of processors) {
            let rowHtml = `
                    <tr class="proc-row">
                        <td class="upgrade-proc-name">${proc.name}</td>
                        <td class="upgrade-proc-cost">${proc.cost}</td>
                        <td class="upgrade-proc-chance">${proc.chanceBuff}</td>
                        <td class="upgrade-proc-hash">${proc.hashPowerBuff}</td>
                        <td class="upgrade-proc-power">${proc.powerBuff}</td>
                        <td class="upgrade-proc-condition">${proc.conditionBuff}</td>
                        <td><button class="purchase-button">Buy</button></td>
                    </tr>
                    `;
            procHtml += rowHtml;
            }
            procHtml += `
                    </tbody>
                </table>
            `;

        document.getElementById('processors-table').innerHTML = procHtml; 
        
        /*--check if proc already purchased, if yes remove button and replace with text --*/
        
        // feature outstanding

        /*--purchase processor --*/
        $(".purchase-button").click(function() {

            /*--create array to hold values associated to button's indirect siblings--*/

            let selectedProc = [];
            selectedProc = $(this).parent().siblings();
            console.log(selectedProc[0]);

            /*--create temp array to pull innerhtml values--*/
            let name = selectedProc[0].innerHTML;
            let cost = parseFloat(selectedProc[1].innerHTML);
            let chance = parseFloat(selectedProc[2].innerHTML);
            let hash = parseFloat(selectedProc[3].innerHTML);
            let power = parseFloat(selectedProc[4].innerHTML);
            let condition = parseFloat(selectedProc[5].innerHTML);
            
                       
            /*--check able to afford, if able to afford run purchaseProc, else display message with current balance --*/

            let price = cost;
            console.log("price", price);

            let currentBal = liveGameData.finance.bankBalance;
            console.log("current Balance", currentBal);
            
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
                console.log("can't afford");

                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            }

            else {
                purchaseProc();
            };

            /*--function to purchase processor---*/

            function purchaseProc() {

                console.log("find procs", liveGameData.parts[0].processor);

                /*--update liveGameData with purchased processor details--*/
                liveGameData.parts[0].processor.name = name;
                liveGameData.parts[0].processor.cost = cost;
                liveGameData.parts[0].processor.chanceBuff = chance;
                liveGameData.parts[0].processor.hashPowerBuff = hash;
                liveGameData.parts[0].processor.powerBuff = power;
                liveGameData.parts[0].processor.conditionBuff = condition;
                
                /*--update processor name displayed on html. --*/
                $("#processor-name").text(liveGameData.parts[0].processor.name);

                /*--add processor to purchased list --*/
                console.log("purchased processor", purchasedProcs);
                purchasedProcs.push(name);
                console.log("purchased rigs", purchasedProcs);

                /*--deduct costs (calculate, update liveGameData and display to page) --*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                console.log(newBalance);

                /*--run Total Active Stats to update performance values and bars --*/
                calcTotalActiveStats();

                /*--redirect after purchase (close modal) --*/
                $('#modal-upgrades').modal('hide');


            } // end of purchase processor function

        }); // end of functions within purchase processor button

    });




    /*--display cooling sys table --*/
    $("#upgrade-cooling-tab").click(function() {
        
        let cooling = gameLibrary.parts[0].coolingSystem;
        console.log("cooling", cooling);

        let coolHtml = `
            <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Chance Buff</th>
                            <th>Speed Buff</th>
                            <th>Power Buff</th>
                            <th>Condition Buff</th>
                            <th>Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
        
        for (cool of cooling) {
            let rowHtml = `
                    <tr class="cool-row">
                        <td class="upgrade-cool-name">${cool.name}</td>
                        <td class="upgrade-cool-cost">${cool.cost}</td>
                        <td class="upgrade-cool-chance">${cool.chanceBuff}</td>
                        <td class="upgrade-cool-hash">${cool.hashPowerBuff}</td>
                        <td class="upgrade-cool-power">${cool.powerBuff}</td>
                        <td class="upgrade-cool-condition">${cool.conditionBuff}</td>
                        <td><button class="purchase-button">Buy</button></td>
                    </tr>
                    `;
            coolHtml += rowHtml;
            }
            coolHtml += `
                    </tbody>
                </table>
            `;

        document.getElementById('cooling-table').innerHTML = coolHtml; 
        
        /*--check if cooling system already purchased, if yes remove button and replace with text --*/
        
        // feature outstanding

         /*--purchase cooling Sys --*/
         $(".purchase-button").click(function() {

            /*--create array to hold values associated to button's indirect siblings--*/

            let selectedCool = [];
            selectedCool = $(this).parent().siblings();
            console.log(selectedCool[0]);

            /*--create temp array to pull innerhtml values--*/
            let name = selectedCool[0].innerHTML;
            let cost = parseFloat(selectedCool[1].innerHTML);
            let chance = parseFloat(selectedCool[2].innerHTML);
            let hash = parseFloat(selectedCool[3].innerHTML);
            let power = parseFloat(selectedCool[4].innerHTML);
            let condition = parseFloat(selectedCool[5].innerHTML);
            
                       
            /*--check able to afford, if able to afford run purchaseCool, else display message with current balance --*/

            let price = cost;
            console.log("price", price);

            let currentBal = liveGameData.finance.bankBalance;
            console.log("current Balance", currentBal);
            
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
                console.log("can't afford");

                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            }

            else {
                purchaseCool();
            };

            /*--function to purchase cooling system---*/

            function purchaseCool() {

                console.log("find coolsys", liveGameData.parts[0].processor);

                /*--update liveGameData with purchased cooling sys details--*/
                liveGameData.parts[0].coolingSystem.name = name;
                liveGameData.parts[0].coolingSystem.cost = cost;
                liveGameData.parts[0].coolingSystem.chanceBuff = chance;
                liveGameData.parts[0].coolingSystem.hashPowerBuff = hash;
                liveGameData.parts[0].coolingSystem.powerBuff = power;
                liveGameData.parts[0].coolingSystem.conditionBuff = condition;
                
                /*--update cooling sys name displayed on html. --*/
                $("#cooling-name").text(liveGameData.parts[0].coolingSystem.name);

                /*--add cooling sys to purchased list --*/
                console.log("purchased coolingSystem", purchasedCoolSys);
                purchasedCoolSys.push(name);
                console.log("purchased coolingSystem", purchasedCoolSys);

                /*--deduct costs (calculate, update liveGameData and display to page) --*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                console.log(newBalance);

                /*--run Total Active Stats to update performance values and bars --*/
                calcTotalActiveStats();

                /*--redirect after purchase (close modal) --*/
                $('#modal-upgrades').modal('hide');


            } // end of purchase cooling sys function

        }); // end of functions within purchase cooling sys button

    });

    /*--display op sys table --*/

    $("#upgrade-os-tab").click(function() {
        
        let opSys = gameLibrary.parts[0].operatingSystem;
        console.log("os", opSys);

        let osHtml = `
            <table class="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Chance Buff</th>
                            <th>Speed Buff</th>
                            <th>Power Buff</th>
                            <th>Condition Buff</th>
                            <th>Purchase</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
        
        for (os of opSys) {
            let rowHtml = `
                    <tr class="os-row">
                        <td class="upgrade-os-name">${os.name}</td>
                        <td class="upgrade-os-cost">${os.cost}</td>
                        <td class="upgrade-os-chance">${os.chanceBuff}</td>
                        <td class="upgrade-os-hash">${os.hashPowerBuff}</td>
                        <td class="upgrade-os-power">${os.powerBuff}</td>
                        <td class="upgrade-os-condition">${os.conditionBuff}</td>
                        <td><button class="purchase-button">Buy</button></td>
                    </tr>
                    `;
            osHtml += rowHtml;
            }
            osHtml += `
                    </tbody>
                </table>
            `;

        document.getElementById('os-table').innerHTML = osHtml; 
        
        /*--check if operating system already purchased, if yes remove button and replace with text --*/
        
        // feature outstanding

    });


    /*--buttons to exit upgrades --*/

    $("#upgrade-exit-btn").click(function() {
        $('#modal-upgrades').modal('hide');
    });

}); //end of upgrade parts function



/*--- 3. Repair Parts -----------------------------------------------------*/

/*--- 4. Energy -----------------------------------------------------*/

/*--- 5. Events -----------------------------------------------------*/

/*--- 6. Crypto-Coin Exchange -----------------------------------------------------*/

/*--- 7. Validate Block -----------------------------------------------------*/

/*--- 8. Mine Block -----------------------------------------------------
        a - pregame checks (i.e. finances, miner status, etc)
        b - generate device and block keys (linked to active device probability range)
        c - run game cycle (incl. check results)
         
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


    //-- Step B - generate device and block keys 
   
    console.log("mine block initiated");

    //runs function to ensure all changes to miner including performnce buffs / events are reflected
    calcTotalActiveStats();

    //set probability ceiling 
    const probability = totalActiveStats.totalChance; 
    const maxValue = 100;
    const range = maxValue - probability; //reduces the maxValue according to the total 'chance' rating
    // puts floor on minimum value to prevent a range of 0 (i.e. if 100% probability)
    if (range < 1) {
        keyRange = 1
    } else {
        keyRange = range
    }

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

    //generate blockKey which is limited to the pre-defined keyRange
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

    //generate minerKey which is limited to the pre-defined keyRange
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

    //display modal and populate semi 'static' fields (semi static, meaning they do not change during the individual game round, but can display different values in other game rounds depending on user actions)

    $('#modal-mine-block').modal('show'); // display modal
    $('#modal-block-mining-response1').text(liveGameData.rig.name);
    $('#modal-block-mining-response2').text(keyRange);
    $('#modal-block-mining-response3').html(0); //Resets number of completed attempts to 0


    //Step C - run game cycle (covers time (10 second cycle less hashSpeed buffs), displays animation whilst running, returns text to indicate when cycle complete, runs match (block vs. miner keys) and animation whilst cycle in play

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

    // outcome A - no win and repeat 
    $("#repeat-mine-btn").click(function() {
        gameCycle();

    });

    // outcome B - no win and exit
    $("#mine-block-exit-btn").click(function() {
        $('#modal-mine-block').modal('hide');
        calcResult();

    });

    // ouctome C - win
    $('#exit-success-mine-btn').click(function() {
        $('#mine-success-img').css('display', 'none');
        $('#exit-success-mine-btn').css('display', 'none');
        $('#modal-mine-block').modal('hide');
        $('#mine-block-exit-btn').css('visibility', 'visible');
        $('#mine-block-exit-footnote').css('visibility', 'visible');
        calcResult();
    })

    // deduct costs (outcome B or C) + add winnings (outcome C only)

    function calcResult() {

        //calc and deduct power usage
        //calc and update stats

        if (outcome = "win") {

        };
        console.log("calcResult complete");
    };


    

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