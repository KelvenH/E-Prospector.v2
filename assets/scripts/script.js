/jshint esversion:8, jquery:true/

/*--- Key Steps & Sequencing -----------------------------------------------------/

1. Utilities;
    1.1 - DOMContentLoaded

2. Game Data Tables;
    2.1 - Full Game Library
    2.2 - Live Game Data (loads with default values and updated through gameplay actions)
    2.3 - *Purchase History
    2.4 - *Temporary Stats
    2.5 - *Total Active Stats
    * initiated as empty arrays so available at Global level. Entries are passed through gemplay actions.

3. Update Game Card;
    3.1 - Load & display default text values
    3.2 - Calculate and display performance stats
    3.3 - Refresh Performance Bars

4. Upgrades;
    4.1 - Display Upgrade Modal
    4.2 - Upgrade Rig*
    4.3 - Upgrade Processor*
    4.4 - Upgrade Cooling System*
    4.5 - Upgrade Operating System*
    4.6 - Exit Upgrade Modal
    * sub-sections to;
        A - Populate modal table
        B - Check if item already purchased (FEATURE OUTSTANDING)
        C -  Purchase Item;
            - create temp array to hold html values of selected item
            - check if able to afford and display modal with balance if unaffordable
            - update liveGameData with purchase
            - update html text
            - add item to Purchase History
            - pass costs (deduct bank balance in liveGameData & html) 
            - refresh stats (incl performance bars) to reflect purchase

5. Repairs 

6. Energy

7. Events 

8. Crypto-Coin Exchange

9. Validate Block

10. Mine Block;
    10.1 - Pre-game checks
    10.2 - Generate Device and Block Keys
    10.3 - Display Modal and Populate Semi-Static Fields
    10.4 - Run Game Cycle
    10.5 - Check Result
    10.6 - Calulcate Result & Update liveGameData and HTML Values

11. Game Stats and Achivements

12. Further Styling / Format Related


--------------------------------------------------------------------------------*/


/*-- 1. Utilities--------------------------------------------------------------*/


//  1.1 : Prepare Game After DOM Loaded


document.addEventListener("DOMContentLoaded", function() {

    console.log("Stage 1: DOM load complete");
    newGame();
});


/*-- 2. Game Data Tables -----------------------------------------------------*/

// 2.1 : Full Game Library 

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

// 2.2 : Live Game Data (initiated with default starting data and ammended through game actions)

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
        bankBalance: 10000,     //temp buff for development - reduce to £1k for gameplay
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


// 2.3 : Purchase history (use to add purchases to avoid a repeated cost to switch to)

const purchasedRigs = [];
const purchasedProcs = [];
const purchasedCoolSys = [];
const purchasedOpSys = [];


// 2.4 : Temporary Stats (captures short-term pos / neg impacts typically as a result of events)

const tempStats = {
    chanceTemp: 9000,      //temp increase to increase speed during testing
    hashPowerTemp: 1000,   //temp increase to increase speed during testing
    pwrUsageTemp: 0,
    conditionTemp: 0
};

// 2.5 : Total Active Stats (calculates the combined ratings of the base + parts + temp impacts)

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


/*-- 3. Update Game Card  -----------------------------------------------------*/

// 3.1 : Load Base Game data and update initial text on html page  

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

// 3.2 : Calculate Total Performance Stats & Update html 


function calcTotalActiveStats() {

    const total = totalActiveStats;
    const base = liveGameData['rig'];
    const proBuff = liveGameData.parts[0].processor;
    const coolBuff = liveGameData.parts[0].coolingSystem;
    const osBuff = liveGameData.parts[0].operatingSystem;
    const temp = tempStats;

    // sum total by applying temp stats to liveGameData, where relevent also round values to nearest whole number and cap max value at 100
    
    // Chance
    let ChanceTotal = (Math.round(base.baseChance + (base.baseChance / 100 * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp))));

    console.log("ChanceTotal", ChanceTotal);

    if (ChanceTotal > 100) {
        total.totalChance = 100
    } else {
        total.totalChance = ChanceTotal
    }
    $("#chance-value").text(total.totalChance);
    
    // Hash Rate 
    HashTotal = (Math.round(base.baseHash + (base.baseHash / 100 * (proBuff.hashPowerBuff + coolBuff.hashPowerBuff + osBuff.hashPowerBuff + temp.hashPowerTemp))));
    if (HashTotal > 100) {
        total.totalHash = 100
    } else {
        total.totalHash = HashTotal
    }
    $("#speed-value").text(total.totalHash);
    
    // Power Useage (note: no cap on power usage)
    total.totalPower = (Math.round(base.basePower + (base.basePower / 100 * (proBuff.powerBuff + coolBuff.powerBuff + osBuff.powerBuff + temp.pwrUsageTemp))));
    $("#power-value").text(total.totalPower);
    
    // Condition
    ConditionTotal = base.baseCondition + (base.baseCondition / 100 * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp));
    if (ConditionTotal > 100) {
        total.totalCondition = 100
    } else {
        total.totalCondition = ConditionTotal
    }
    $("#condition-value").text(total.totalCondition);

    


    /*--TEMPORARY CONSOLE LOGS - REMOVE FROM FINAL VERSION--*/
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




// 3.3 : Refresh Performance Bars 

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



/*-- 4. Upgrades  -----------------------------------------------------*/

// 4.1 : Display Upgrade Modal

$("#terminal-miner-upgradebtn").click(function() {
    $('#modal-upgrades').modal('show');
    
    // 4.2 : Upgrade Rig 

    // A: Display Table
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

        // B: Check if already purchased (if yes remove button and replace with text)
        
        /*-- this feature is outstanding as unable to implement IF statement within template literal --*/


        // C: Purchase Rig 
        $(".purchase-button").click(function() {

            /*-- create temp array to hold html values associated to button's indirect siblings--*/

            let selectedRig = [];
            selectedRig = $(this).parent().siblings();
            console.log(selectedRig[0]);

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

    
    // 4.3 : Upgrade Processor

    // A: Display Table
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
        
        // B: Check if already purchased (if yes remove button and replace with text)
        
        /*-- this feature is outstanding as unable to implement IF statement within template literal --*/

        
        // C: Purchase Processor
        $(".purchase-button").click(function() {

            /*--create temp array to hold html values associated to button's indirect siblings--*/

            let selectedProc = [];
            selectedProc = $(this).parent().siblings();
            console.log(selectedProc[0]);

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

    }); // end of processor upgrades function


    // 4.4 : Upgrade Cooling System

    // A: Display Table
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
        
        // B: Check if already purchased (if yes remove button and replace with text)
        
        /*-- this feature is outstanding as unable to implement IF statement within template literal --*/


        // C: Purchase Cooling System
        $(".purchase-button").click(function() {

        /*-- create temp array to hold html values associated to button's indirect siblings--*/

        let selectedCool = [];
        selectedCool = $(this).parent().siblings();
        console.log(selectedCool[0]);

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

            console.log("find coolsys", liveGameData.parts[0].coolingSystem);

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

    }); // end of cooling system upgrades function


    // 4.5 Upgrade Operating System

    // A: Display Table
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
        
        // B: Check if already purchased (if yes remove button and replace with text)
        
        /*-- this feature is outstanding as unable to implement IF statement within template literal --*/


        // C: Purchase Operating System 
        $(".purchase-button").click(function() {

            /*--create temp array to hold html values associated to button's indirect siblings--*/
    
            let selectedOs = [];
            selectedOs = $(this).parent().siblings();
            console.log(selectedOs[0]);
    
            /*--create temp array to pull innerhtml values--*/
            let name = selectedOs[0].innerHTML;
            let cost = parseFloat(selectedOs[1].innerHTML);
            let chance = parseFloat(selectedOs[2].innerHTML);
            let hash = parseFloat(selectedOs[3].innerHTML);
            let power = parseFloat(selectedOs[4].innerHTML);
            let condition = parseFloat(selectedOs[5].innerHTML);
            
                        
            /*--check able to afford, if able to afford run purchaseOpSys, else display message with current balance --*/
    
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
                purchaseOpSys();
            };
    
            /*--function to purchase Operating System---*/
    
            function purchaseOpSys() {
    
                console.log("find opSys", liveGameData.parts[0].operatingSystem);
    
                /*--update liveGameData with purchased op sys details--*/
                liveGameData.parts[0].operatingSystem.name = name;
                liveGameData.parts[0].operatingSystem.cost = cost;
                liveGameData.parts[0].operatingSystem.chanceBuff = chance;
                liveGameData.parts[0].operatingSystem.hashPowerBuff = hash;
                liveGameData.parts[0].operatingSystem.powerBuff = power;
                liveGameData.parts[0].operatingSystem.conditionBuff = condition;
                
                /*--update op sys name displayed on html. --*/
                $("#software-name").text(liveGameData.parts[0].operatingSystem.name);
    
                /*--add op sys to purchased list --*/
                console.log("purchased operatingSystem", purchasedOpSys);
                purchasedOpSys.push(name);
                console.log("purchased operatingSystem", purchasedOpSys);
    
                /*--deduct costs (calculate, update liveGameData and display to page) --*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                console.log(newBalance);
    
                /*--run Total Active Stats to update performance values and bars --*/
                calcTotalActiveStats();
    
                /*--redirect after purchase (close modal) --*/
                $('#modal-upgrades').modal('hide');
    
    
                } // end of purchase op sys function
    
            }); // end of functions within purchase op sys button

    }); // end of opSys upgrades function


    // 4.6 : Exit Upgrade Modal

    $("#upgrade-exit-btn").click(function() {
        $('#modal-upgrades').modal('hide');
    });

}); //end of Upgrades function



/*-- 5. Repairs  -----------------------------------------------------------*/

/*-- 6. Energy -------------------------------------------------------------*/

/*-- 7. Events -------------------------------------------------------------*/

/*-- 8. Crypto-Coin Exchange -----------------------------------------------*/

/*-- 9. Validate Block -----------------------------------------------------*/

/*-- 10. Mine Block -------------------------------------------------------*/

        
//called from 'on-click' added inline to miner play button (html)

$("#terminal-miner-activatebtn").click(function() {

// 10.1 : Pre-Game Checks (i.e. finances, miner status, etc)    

    /*-- OUTSTANDING!!! - Consider adding checks which must pass prior to being able to run game//

    /*-- list of items to check;

                    Finances
                    - balance not negative (must be able to afford electricity costs. Redirect to block validation and / or exchange crypto-coin)

                    Miner
                    - status not Paused (event-in play) /  Disabled (repair needed or due to event)
                    - miner selected 

                    Energy
                    - provider selected--*/


    // 10.2 : Generate Device and Block Keys 
   
    console.log("mine block initiated");

    //runs function to ensure all changes to miner including performance buffs / events are reflected
    calcTotalActiveStats();

    //set probability ceiling 
    const probability = totalActiveStats.totalChance; 
    const maxValue = 100;
    const range = maxValue - probability; //reduces the maxValue according to the total 'chance' rating
    // puts floor on minimum value to prevent a range of 0 (i.e. if 100% probability)
    if (range < 1) {
        keyRange = 1;
    } else {
        keyRange = range;
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
            alert("Error: BlockKey is out of range, please re-click to mine block!"); // BUG experienced in development, should not be enouncountered now min floor value assigned but retained in case of unexpected behaviour through events / buffs 
            console.log("blockKey:", blockKey);
        } else {
            console.log("blockKey:", blockKey);
        }
        return blockKey;
    }

    //generate minerKey which is limited to the pre-defined keyRange
    let minerKey = 0;

    function generateMinerKey() {
        minerKey = Math.floor(Math.random() * keyRange) + 1;
        if (minerKey > keyRange) {
            alert("Error: MinerKey is out of range, please re-click to mine block!");
            console.log("minerKey:", minerKey);
        } else {
            console.log("minerKey:", minerKey);
        }
        return minerKey;
    }

    // 10.3 : Display modal and populate semi 'static' fields (semi static, meaning they do not change during the individual game round, but can display different values in other game rounds depending on user actions)

    $('#modal-mine-block').modal('show'); // display modal
    $('#modal-block-mining-response1').text(liveGameData.rig.name);
    $('#modal-block-mining-response2').text(keyRange);
    $('#modal-block-mining-response3').html(0); //Resets number of completed attempts to 0



    // 10.4: Run Game Cycle (time is 10 second cycle less hashSpeed buffs, displays animation whilst running, returns text to indicate when cycle complete and runs match (block vs. miner keys)

    //Cycle timer : length = 10secs (10,000millisecs) less % hash speed bonus
    let hashSpeed = totalActiveStats.totalHash / 100; //to convert to percentage;
    console.log("hashspeed", hashSpeed);
    let maxCounter = 10; // maximum (unbuffed) speed of 10secs to mine block
    let buffedSpeed = maxCounter - (maxCounter * hashSpeed); //reduces the maxValue according to the total hashSpeed buff
    console.log("buffedSpeed", buffedSpeed);

    let count = document.getElementById('modal-block-mining-response3').innerHTML; //increment count of attempts (set to 0 (in display modal section) for 1st round but increased through GameCycle for round 2+)


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
    }

    //10.5 : Check Result (determines if success / fail messages, buttons and redirects to display)

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

            outcome = "win";
            return outcome;

        } else {
            $('#modal-block-mining-response5').text('Key Not Accepted');
            $('#repeat-mine-btn').css('visibility', 'visible'); //display button to run again (note, btn rehidden after next cycle commences to prevent multi-clicks / attempts)
        }

    }

    // Redirects for different outcomes

    // outcome 1 - no win and try again 
    $("#repeat-mine-btn").click(function() {
        gameCycle();

    });

    // outcome 2 - no win and exit
    $("#mine-block-exit-btn").click(function() {
        $('#modal-mine-block').modal('hide');
        calcResult();

    });

    // ouctome 3 - win (also resets from success to default to avoid these displaying at start of next attempt)
    $('#exit-success-mine-btn').click(function() {
        $('#mine-success-img').css('display', 'none');
        $('#exit-success-mine-btn').css('display', 'none');
        $('#modal-mine-block').modal('hide');
        $('#mine-block-exit-btn').css('visibility', 'visible');
        $('#mine-block-exit-footnote').css('visibility', 'visible');
        console.log("round win - exit button selected");
        calcResult();
    });

    // deduct costs (outcome 2 or 3) + add winnings (outcome 3 only)
    

    // 10.6 : Calculate Result (1 - costs / power useage, 2 - update stats. 3 - update winnings)

    function calcResult() {

        
        // Part 1 - calc and deduct power usage
        
        // Part 2 - update stats (incl. condition deterioration)

        // Part 3 - calc winnings

        if (outcome == "win") {

            // add coin to ewallet balance
            let currentCoinBalance = parseInt(document.getElementById('ewallet-value').innerHTML);
            console.log("current coin balance", currentCoinBalance);
            let newCoin = 1;
            console.log("new coin", newCoin);
            let newCoinBalance = currentCoinBalance + newCoin;
            console.log("newCoinBalance", newCoinBalance);
            $('#ewallet-value').text(newCoinBalance);
        
            /*--
            // adds 1 to stats 'blocks mined'           
            let newBlockMined = document.getElementById('stats-3-txt').innerHTML;
            ++newBlockMined;
            $('#stats-3-txt').html(newBlockMined);
            console.log("newBlockMined", newBlockMined);
            --*/

        }
        console.log("calcResult complete");
    } 

});









/*-- 11. Game Stats and Achivements -----------------------------------------------------*/

/*-- 12. Further Styling / Format Related -----------------------------------------------------*/