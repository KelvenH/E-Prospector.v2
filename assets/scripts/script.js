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

4. In Game checks;
    4.1 - Finances;
        - Game Over (no funds or coins)
        - No Funds but have Coins (need to exchange)
    4.2 - Miner Status Unavailable
    4.3 - Energy

5. Upgrades;
    5.1 - Display Upgrade Modal
    5.2 - Upgrade Rig*
    5.3 - Upgrade Processor*
    5.4 - Upgrade Cooling System*
    5.5 - Upgrade Operating System*
    5.6 - Exit Upgrade Modal
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

6. Repairs; 

7. Energy;
    A - Display Table
    B - Switch Supplier

8. Events; 

9. Crypto-Coin Exchange;
    9.1 - Calculate moving coin to £ exchange rate
    9.2 - Exchange Coins

10. Mine Block;
    10.1 - Deactivate Function Buttons
    10.2 - Pre-game checks
    10.3 - Generate Device and Block Keys
    10.4 - Prepare Activity Pane
    10.5 - Run Game Cycle
    10.5B - Early Terminate Function 
    10.6 - Check Result
    10.7 - Calulcate Result & Update liveGameData and HTML Values



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
        baseCondition: 25,
        rigComments: "Ironically for the i-pop this one runs a dream….before well, she 'pops'! Rewards should cover the repairs and keep you in the black."
    },
    {
        name: "Coin - Ripper",
        cost: 70000,
        multiCore: "Y",
        baseChance: 50,
        baseHash: 50,
        basePower: 1500,
        baseCondition: 60,
        rigComments: "More expensive, but the cheapest of the terminals purpose built for crypto-mining. Things are getting serious now!"
    },
    {
        name: "Blackbox X-Series",
        cost: 100000,
        multiCore: "Y",
        baseChance: 60,
        baseHash: 50,
        basePower: 2000,
        baseCondition: 65,
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
                cost: 500,
                chanceBuff: 0,
                hashPowerBuff: 20,
                powerBuff: 0,
                conditionBuff: 50
            },
            {
                name: "Orange OS",
                cost: 500,
                chanceBuff: 50,
                hashPowerBuff: 0,
                powerBuff: 0,
                conditionBuff: 75
            },
            {
                name: "Blackbox .IO",
                cost: 2000,
                chanceBuff: 75,
                hashPowerBuff: 75,
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
        comments: "UK's leading renewable energy provider. The less than ideal geographical location means reliability can be patchy at best (then you may find yourself shouting the companies initials)."
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
    }],
    events: [{
        title: "Hacker Attack",
        description: "A vulnerability flaw has been exposed in the latest OS update",
        choices: "You can pay £100 fee to download cyber security software or take a risk",
        choiceA: "Option A: Pay £100 for security software",
        choiceB: "Option B: Take a risk that you will not be compromised",
        optA_Win: "You paid your £100, but could have been worse!",
        optA_Lose: "Good news - you paid £100 and the OS release identified efficiencies leading to a temporary 25% performance boost",
        optB_Win: "Great news - there was no attempted hack of your terminal, and the OS security patch also identified efficiencies leading to a temporary 50% performance boost!",
        optB_Lose: "Bad news - the head in the sand approach didn't work, hackers managed to access your password and steal 25% of your balance before the bank were able to freeze"
    },
    {
        title: "Title 2",
        description: "Description 2",
        choices: "You have choices 2",
        choiceA: "Option A: (2)",
        choiceB: "Option B: (2)",
        optA_Win: "Opt A Win (2)",
        optA_Lose: "Opt A Lose (2)",
        optB_Win: "Opt B Win (2)",
        optB_Lose: "Opt B Lose (2)"

    },
    {
        title: "Title 3",
        description: "Description 3",
        choices: "You have choices 3",
        choiceA: "Option A: (3)",
        choiceB: "Option B: (3)",
        optA_Win: "Opt A Win (3)",
        optA_Lose: "Opt A Lose (3)",
        optB_Win: "Opt B Win (3)",
        optB_Lose: "Opt B Lose (3)"
    },
    {
        title: "Title 4",
        description: "Description 4",
        choices: "You have choices 4",
        choiceA: "Option A: (4)",
        choiceB: "Option B: (4)",
        optA_Win: "Opt A Win (4)",
        optA_Lose: "Opt A Lose (4)",
        optB_Win: "Opt B Win (4)",
        optB_Lose: "Opt B Lose (4)"
    },
    {
        title: "Title 5",
        description: "Description 5",
        choices: "You have choices 5",
        choiceA: "Option A: (5)",
        choiceB: "Option B: (5)",
        optA_Win: "Opt A Win (5)",
        optA_Lose: "Opt A Lose (5)",
        optB_Win: "Opt B Win (5)",
        optB_Lose: "Opt B Lose (5)"
    },
    {
        title: "Title 6",
        description: "Description 6",
        choices: "You have choices 6",
        choiceA: "Option A: (6)",
        choiceB: "Option B: (6)",
        optA_Win: "Opt A Win (6)",
        optA_Lose: "Opt A Lose (6)",
        optB_Win: "Opt B Win (6)",
        optB_Lose: "Opt B Lose (6)"
    },
    {
        title: "Title 7",
        description: "Description 7",
        choices: "You have choices 7",
        choiceA: "Option A: (7)",
        choiceB: "Option B: (7)",
        optA_Win: "Opt A Win (7)",
        optA_Lose: "Opt A Lose (7)",
        optB_Win: "Opt B Win (7)",
        optB_Lose: "Opt B Lose (7)"
    },
    {
        title: "Title 8",
        description: "Description 8",
        choices: "You have choices 8",
        choiceA: "Option A: (8)",
        choiceB: "Option B: (8)",
        optA_Win: "Opt A Win (8)",
        optA_Lose: "Opt A Lose (8)",
        optB_Win: "Opt B Win (8)",
        optB_Lose: "Opt B Lose (8)"
    },
    {
        title: "Title 9",
        description: "Description 9",
        choices: "You have choices 9",
        choiceA: "Option A: (9)",
        choiceB: "Option B: (9)",
        optA_Win: "Opt A Win (9)",
        optA_Lose: "Opt A Lose (9)",
        optB_Win: "Opt B Win (9)",
        optB_Lose: "Opt B Lose (9)"
    },
    {
        title: "Title 10",
        description: "Description 10",
        choices: "You have choices 10",
        choiceA: "Option A: (10)",
        choiceB: "Option B: (10)",
        optA_Win: "Opt A Win (10)",
        optA_Lose: "Opt A Lose (10)",
        optB_Win: "Opt B Win (10)",
        optB_Lose: "Opt B Lose (10)"
    }
]};

// 2.2 : Live Game Data (initiated with default starting data and ammended through game actions)

const liveGameData = {
    rig: {
        name: "Comm-Atari-ZX",
        cost: 0,
        multiCore: "N",
        baseChance: 1,
        baseHash: 1,
        basePower: 1,
        baseCondition: 20,
        rigComments: "Self-built from re-purposed parts from 1980's tech - hey, it's free?!",
        status: "Available"
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
        bankBalance: 1000,     //temp buff for development - reduce to £1k for gameplay
        ewalletBalance: 0,
        fxRate: 1000
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
        blocksAttempted: 0,
        coinsMined: 0,
        moneyEarned: 0,
        pollutionOutput: 0,
        cyberThwarts: 0,
        cyberSuffered: 0
    }
};


// 2.3 : Purchase history (use to add purchases to avoid a repeated cost to switch to)

const purchasedRigs = [];
const purchasedProcs = [];
const purchasedCoolSys = [];
const purchasedOpSys = [];


// 2.4 : Temporary Stats (captures short-term pos / neg impacts typically as a result of events)

const tempStats = {
    chanceTemp: 10000,      //temp increase to increase speed during testing
    hashPowerTemp: 5000,   //temp increase to increase speed during testing
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
    
    // load initial stats
    const stats = liveGameData['stats'];
    $("#stat1-result").text(stats.blocksAttempted);
    $("#stat2-result").text(stats.coinsMined);
    $("#stat3-result").html("<span>£ </span>" + stats.moneyEarned);
    $("#stat4-result").html(stats.pollutionOutput + "<span> k/w</span>");
    $("#stat5-result").text(stats.cyberThwarts);
    $("#stat6-result").text(stats.cyberSuffered);

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
    ConditionTotal = (Math.round(base.baseCondition + (base.baseCondition / 100 * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp))));
    if (ConditionTotal > 100) {
        total.totalCondition = 100
    } else if (ConditionTotal < 0) {
        total.totalCondition = 0            //prevent performance deteriorating below zero
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
    // formatting on condition bar to indicate health

    console.log("color", total.totalCondition);

    if (total.totalCondition < 20) {
        $("#condition-meter-bar").css("background-color", "var(--ink10-red)");
    } else if (total.totalCondition < 40) {
        $("#condition-meter-bar").css("background-color", "var(--ink11-amber)");
    } else {
        $("#condition-meter-bar").css("background-color", "var(--ink12-green)");
    }
};

/*-- 4. In Game Checks  (function called prior to running game cycle and after)--*/

function inGameChecks() {
    // 4.1 :  Finance checks 
        
    // Game Over
    if ((liveGameData.finance.bankBalance < 1) && (liveGameData.finance.ewalletBalance < 1)) {
        $('#modal-gameover').modal('show');
        console.log("game over");

        $("#game-over-btn").unbind('click').click(function() {
            location.reload();
        });
        return; //prevent function from progressing with gamecycle

    // No funds but has crypto-coin to exchange
    } else if ((liveGameData.finance.bankBalance < 1) && (liveGameData.finance.ewalletBalance > 0)) {
        $('#modal-no-funds').modal('show');
        console.log("no funds over");

        $("#no-funds-btn").unbind('click').click(function() {
            $('#modal-no-funds').modal('hide');
        });
        return; //prevent function from progressing with gamecycle
    };

    // 4.2 : Miner Status
 
    if (liveGameData.rig.status == "Available" ) {

        $("#terminal-miner-status-available").css("display", "block");
        $("#terminal-miner-activatebtn").css("display", "block");
        $("#terminal-miner-status-unavailable").css("display", "none");
        
    } else if (liveGameData.rig.status == "Unavailable" ) {

        $("#terminal-miner-status-available").css("display", "none");
        $("#terminal-miner-activatebtn").css("display", "none");
        $("#terminal-miner-status-unavailable").css("display", "block");

        $('#modal-unavailable').modal('show');
        console.log("rig unavailable");

        $("#unavailable-btn").unbind('click').click(function() {
            $('#modal-unavailable').modal('hide');
        });
        return; //prevent function from progressing with gamecycle
    };

    // 4.3 Energy
                    


} // end game checks


/*-- 5. Upgrades  -----------------------------------------------------*/

// 5.1 : Display Upgrade Modal

$("#terminal-miner-upgradebtn").click(function() {
    $('#modal-upgrades').modal('show');
    
    // 5.2 : Upgrade Rig 

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
            
            } else {
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

    
    // 5.3 : Upgrade Processor

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


    // 5.4 : Upgrade Cooling System

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


    // 5.5 Upgrade Operating System

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


    // 5.6 : Exit Upgrade Modal

    $("#upgrade-exit-btn").click(function() {
        $('#modal-upgrades').modal('hide');
    });

}); //end of Upgrades function



/*-- 6. Repairs  -----------------------------------------------------------*/

// check if total active condition is 0 if yes display modal to advise rig broken and need to buy a new one, otherwise display modal to purchase repair which costs 50% of rig price

$("#terminal-miner-repairbtn").click(function() {
    // display repair modal
    $('#modal-repair').modal('show');
    
    // calculate and display cost of repair
    let rigCost = liveGameData.rig.cost;
    let repairCost = rigCost / 4;
    $('#repair-cost').text(repairCost);    

    $("#repair-exit-btn").click(function() {
        $('#modal-repair').modal('hide');
    });

    $("#pay-repairs-btn").click(function() {
        $('#modal-repair').modal('hide');
        // check if funds to pay for repairs...
        let currentBal = liveGameData.finance.bankBalance;
        if (repairCost > currentBal) {
            //..display can not afford modal
            $('#modal-unaffordable').modal('show');
            $('#unaffordable-balance').text(currentBal);
            $("#unaffordable-exit-btn").click(function() {
                $('#modal-unaffordable').modal('hide');
            });

        } else {
            //...display modal confirming repair, pass the costs and restore the condition
            $('#modal-confirm-repaired').modal('show');
            $('#modal-unaffordable').modal('hide'); //Bug Fix; although this modal should not be displayed there were experiences of it appearing after exiting the 'confirm repaired modal'
            $('#repaired-cost').text(repairCost);
            newBalance = liveGameData.finance.bankBalance - repairCost;
            liveGameData.finance.bankBalance = newBalance; // update bank balance 
            $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
            tempStats.conditionTemp = 0;  // restores temp condition buff to zero 
            $("#repaired-exit-btn").click(function() {
                $('#modal-unaffordable').modal('hide'); //Bug Fix; although this modal should not be displayed there were experiences of it appearing after exiting the 'confirm repaired modal'
                $('#modal-confirm-repaired').modal('hide');
            });
        }
    });
});


/*-- 7. Energy -------------------------------------------------------------*/

$("#energy-btn").click(function() {
    $('#modal-energy').modal('show');

    // A: Display Table
   
    let providers = gameLibrary['energy'];
    console.log("providers", providers);

    let energyHtml = `
        <table class="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Provider</th>
                        <th>Up Front Cost</th>
                        <th>Type</th>
                        <th>£ per k/w</th>
                        <th>Reliability</th>
                        <th>Pollution Rating</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
    for (provider of providers) {
        let rowHtml = `
                <tr class="energy-row">
                    <td class="energy-provider">${provider.provider}</td>
                    <td class="energy-cost">${provider.upfrontCost}</td>
                    <td class="energy-type">${provider.type}</td>
                    <td class="energy-useage-cost">${provider.usageCostPerKw}</td>
                    <td class="energy-reliability">${provider.reliability}</td>
                    <td class="energy-pollution">${provider.pollutionRating}</td>
                    <td class="energy-comments">${provider.comments}</td>
                    <td><button class="choose-provider-button">Choose</button></td>
                </tr>
                `;
        energyHtml += rowHtml;
        }
        energyHtml += `
                </tbody>
            </table>
        `;

    document.getElementById('energy-table').innerHTML = energyHtml; 


    // B: Switch Supplier
    $(".choose-provider-button").unbind('click').click(function() {
        
        /*-- create temp array to hold html values associated to button's indirect siblings--*/

        let selectedProvider = [];
        selectedProvider = $(this).parent().siblings();
        console.log(selectedProvider[0]);

        let provider = selectedProvider[0].innerHTML;
        let cost = parseFloat(selectedProvider[1].innerHTML);
        let type = selectedProvider[2].innerHTML;
        let useage = parseFloat(selectedProvider[3].innerHTML);
        let reliability = selectedProvider[4].innerHTML;
        let pollution = selectedProvider[5].innerHTML;
        let comments = selectedProvider[6].innerHTML;
    
        /*--check able to afford, if able to afford run chooseSupplier, else display message with current balance --*/

        let price = cost;
        console.log("price", price);

        let currentBal = liveGameData.finance.bankBalance;
        console.log("current Balance", currentBal);
        
        if (price > currentBal) {
            $('#modal-energy').modal('hide');
            $('#modal-unaffordable').modal('show');
            $('#unaffordable-balance').text(currentBal);
            console.log("can't afford");

            $("#unaffordable-exit-btn").click(function() {
                $('#modal-unaffordable').modal('hide');
            });

        } else {
            chooseSupplier();
        };

        /*--function to purchase rig---*/

        function chooseSupplier() {

            /*--update liveGameData with supplier details--*/
            liveGameData.energy.provider = provider;
            liveGameData.energy.upfrontCost = cost;
            liveGameData.energy.type = type;
            liveGameData.energy.usageCostPerKw = useage;
            liveGameData.energy.reliability = reliability;
            liveGameData.energy.pollutionRating = pollution;
            liveGameData.energy.comments = comments;
            
            /*--update supplier details displayed on html. --*/
            $("#provider-response").text(liveGameData.energy.provider);
            $("#type-response").text(liveGameData.energy.type);
            $("#cost-response").text(liveGameData.energy.usageCostPerKw);
            $("#reliability-response").text(liveGameData.energy.reliability);
            $("#pollution-rating-response").text(liveGameData.energy.pollutionRating);
            $("#statement").text(liveGameData.energy.comments);
            

            /*--deduct upfront costs (calculate, update liveGameData and display to page)--*/
            newBalance = liveGameData.finance.bankBalance - cost;
            liveGameData.finance.bankBalance = newBalance;
            $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
            console.log(newBalance);

           
            /*--redirect after purchase (close modal)--*/
            $('#modal-energy').modal('hide');

        } // end of change supplier function
    })
});


/*-- 8. Events -------------------------------------------------------------*/

// 8.1 : determine if event occurs
function newEvent() {
    console.log("new Event script reached");
    let eventHappen = Math.floor(Math.random() * 2); // generate no. 0 - 19

    console.log("eventHappen", eventHappen)
    
    //1 in 20 chance of event occuring prevents occuring too frequently
    if (eventHappen == 1) {
        //disable other functional buttons to prevent unexpected behaviour
        $('#terminal-miner-upgradebtn').prop('disabled', true);
        $('#terminal-miner-repairbtn').prop('disabled', true);
        $('#energy-btn').prop('disabled', true);
        $('#terminal-miner-activatebtn').prop('disabled', true);

        $('#msg-alert').css('display', 'block');
        let eventBank = gameLibrary.events;
        let randomEvent = eventBank[Math.random() * eventBank.length | 0]; //random selection from events array
        console.log("eventBank", eventBank);
        console.log("randomEvent", randomEvent);
        let randomTitle = randomEvent.title;
        let randomDescription = randomEvent.description;
        let randomChoices = randomEvent.choices;
        let randomChoiceA = randomEvent.choiceA;
        let randomChoiceB = randomEvent.choiceB;
        let randomOptA_Win = randomEvent.optA_Win;
        let randomOptA_Lose = randomEvent.optA_Lose;
        let randomOptB_Win = randomEvent.optB_Win;
        let randomOptB_Lose =  randomEvent.optB_Lose;

        $('#msg-title').css('display', 'block').text(randomTitle);
        $('#msg-event').css('display', 'block').text(randomDescription);
        $('#msg-choices').css('display', 'block').text(randomChoices);
        
        $('#msg-optA-txt').css('display', 'block').text(randomChoiceA);
        
        $('#msg-optB-txt').css('display', 'block').text(randomChoiceB);
        $('#msg-btn-optA').css('display', 'block');
        $('#msg-btn-optB').css('display', 'block');

    }
    else {
        console.log("No random Event");
    }
};








/*-- 9. Crypto-Coin Exchange -----------------------------------------------*/

// 9.1 : Calculate a moving exchange rate every 30 seconds 

let currentExRate = liveGameData.finance.fxRate;
let exInterval = setInterval(update, 60000); //30,000 = 30 secs (!!change back to 30)

function update () {
    let num = Math.random(); //generates a random float value (0 - 1)
    console.log("num1", num);
    num *= Math.round(Math.random()) ? 1 : -1; // randomly determines a positive or negative value [Acknowledgement to online post: https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value]
    console.log("num2", num);
    let movingRate = num / 10; // caps range of movement between -10% and +10% 
    console.log("num3", movingRate);
    let newRate = currentExRate + (currentExRate * movingRate); // calculates rate move against existing exchnage rate
    liveGameData.finance.fxRate= newRate.toFixed(2); // updates gameLibrary with new exchnage rate fixed to 2 decimal places
    $("#exchange-value").contents()[1].nodeValue = liveGameData.finance.fxRate; // updates value displayed on screen
    console.log("num4", newRate);
}

// 9.2 : Exchange Coins 

$("#exchange-btn").click(function() {
    let wallet = liveGameData.finance.ewalletBalance;
    let exRate = liveGameData.finance.fxRate;
    let exValue = wallet * exRate;
    
    $('#modal-exchange').modal('show');
    $('#wallet-balance').text(wallet);
    $('#exchange-rate').text(exRate);
    $('#exchange-returned').text(exValue);


    $('#exchange-deal-btn').unbind('click').click(function() {
        // reset ewallet balance to zero in library and on screen
        liveGameData.finance.ewalletBalance = 0;
        $('#ewallet-value').text(0);

        // update bank balance with value of exchange in library and on screen
        liveGameData.finance.bankBalance =  liveGameData.finance.bankBalance + exValue;
        $('#bank-value').contents()[1].nodeValue = liveGameData.finance.bankBalance;
        
        // update money earned stat
        let newMoneyEarned = exValue + liveGameData.stats.moneyEarned;
        liveGameData.stats.moneyEarned = newMoneyEarned;
        $('#stat3-result').html("<span>£ </span>" + liveGameData.stats.moneyEarned);
       

        $('#modal-exchange').modal('hide');

    });


    $('#exchange-exit-btn').click(function() {
        $('#modal-exchange').modal('hide');
    });

});


/*-- 10. Mine Block -------------------------------------------------------*/

        
//called from 'on-click' added inline to miner play button (html)

$("#terminal-miner-activatebtn").unbind('click').click(function() {
    
    // 10.0 : Hide Stats Grid
    $('#mining-stats-grid').css('display', 'none');

    // 10.1 : Deactivate Repair, Upgrade and Energy Buttons (Bug Fix : unexpected behavious encountered if changes made during gameplay)

    $('#terminal-miner-upgradebtn').prop('disabled', true);
    $('#terminal-miner-repairbtn').prop('disabled', true);
    $('#energy-btn').prop('disabled', true);

    // 10.2 : Pre-Game Checks    
    inGameChecks();

    // 10.3 : Generate Device and Block Keys 
   
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
        console.log("allKeys", allKeys);
        
        minerKey = Math.floor(Math.random() * allKeys.length +1); // random selection from the array of keyRange
        console.log("minerKey", minerKey);
        
        // find the random chosen key and remove from array to prevent re-selection 
        let index = allKeys.indexOf(minerKey);
        if (index > -1) {
            allKeys.splice(index, 1);
        }
        console.log("allKeys", allKeys);
        console.log("minerKey", minerKey);
        //BUG: the minerKey is being selected from the allKeys array and console.log shows this is then removed, but this does not prevent the minerKey from choosing the same item on a further attempt 

        return minerKey; 

    }

    // 10.4 : Prepare Activity Pane - Populate semi 'static' fields (semi static, meaning they do not change during the individual game round, but can display different values in other game rounds depending on user actions)
    
    $('#terminal-miner-activatebtn').css('display', 'none');
    $('#terminal-miner-stopbtn').css('display', 'inline-block');
    $('#block-mining-response1').text("Running");
    $('#block-mining-line2').css('display', 'block');
    $('#block-mining-response2').css('display', 'block').text(keyRange);
    $('#block-mining-line3').css('display', 'block');
    $('#block-mining-response3').css('display', 'block').text(0); //Resets number of completed attempts to 0
    $('#block-mining-power-used-label').css('display', 'block');
    $('#block-mining-power-used').css('display', 'block').html("0"+$('#block-mining-power-used span')[0].outerHTML);
    $('#block-mining-power-cost-label').css('display', 'block');
    $('#block-mining-power-cost').css('display', 'block').html("<span>£ </span>" + "0");
    $('#block-mining-progressbar').css('display', 'flex');


    // 10.5: Run Game Cycle (time is 10 second cycle less hashSpeed buffs, displays animation whilst running, returns text to indicate when cycle complete and runs match (block vs. miner keys)

    //Cycle timer : length = 10secs (10,000millisecs) less % hash speed bonus
    let hashSpeed = totalActiveStats.totalHash / 100; //to convert to percentage;
    console.log("hashspeed", hashSpeed);
    let maxCounter = 10; // maximum (unbuffed) speed of 10secs to mine block
    let buffedSpeed = maxCounter - (maxCounter * hashSpeed); //reduces the maxValue according to the total hashSpeed buff
    console.log("buffedSpeed", buffedSpeed);

    let count = document.getElementById('block-mining-response3').innerHTML; //increment count of attempts (set to 0 (in display  section) for 1st round but increased through GameCycle for round 2+)
 

    //failed attempts re-start from here
    gameCycle();

    function gameCycle() {

        generateMinerKey(minerKey);
        var timeleft = buffedSpeed;
        $('#block-mining-response1').text("Running");
        $('#block-mining-reattempt').css('display', 'none');
        $('#block-mining-reattempt-count').css('display', 'none');

        var timer = setInterval(function() {


            // 10.5B: Early Terminate Function  - gamecycle placed inside button allowing play to be terminated with default of 'no win'

            $('#terminal-miner-stopbtn').unbind('click').click(function() {
                clearInterval(timer);
                outcome = "no win";
                calcResult(outcome);
                }
            );

            let progressBar = $('#inner-mining-progress-bar');
            let currentProgress = 100 - ((timeleft / buffedSpeed) * 100);    
           

            if (timeleft <= 0) {
                clearInterval(timer);
                progressBar.attr('aria-valuemax', buffedSpeed);
                progressBar.css('width', currentProgress + '%').addClass("no-animation"); //Bug Fix : class applied to remove animation for reversefill to prevent timer appearing to re-start from c. 20% - 40% depending on speed
                progressBar.attr('aria-valuenow', currentProgress);
                $('#block-mining-response1').text("Checking Result");
                $('#block-mining-line5').css('display', 'block');
                $('#block-mining-response5').css('display', 'block'); //display result line
                


                //increment attempt count
                console.log("count=", count); 
                ++count;
                console.log("count=", count);
                $('#block-mining-response3').html(count);
                console.log("count=", count);

                //update power used
                let currentPowerUsage = totalActiveStats.totalPower * count;
                $('#block-mining-power-used').html(currentPowerUsage +$('#block-mining-power-used span')[0].outerHTML);
                let currentPowerCost = (currentPowerUsage * liveGameData.energy.usageCostPerKw).toFixed(2);
                $('#block-mining-power-cost').html("<span>£ </span>" + currentPowerCost);

                checkResult(minerKey, blockKey);

            } else {
                progressBar.attr('aria-valuemax', buffedSpeed);
                progressBar.css('width', currentProgress + '%').removeClass("no-animation");
                progressBar.attr('aria-valuenow', currentProgress);
                console.log("buffedSpeed", buffedSpeed);
                console.log("timeleft", timeleft);
                console.log("currentProgress", currentProgress);
        
            } 
            timeleft -= 0.5;
        }, 500);
    }

    //10.6 : Check Result (determines if success / fail messages, buttons and redirects to display)

    let outcome = "";

    function checkResult(minerKey, blockKey) {
        console.log("minerKey vs blockKey", minerKey, "v", blockKey);
        if (minerKey === blockKey) {

            $('#block-mining-response5').text('Success, block mined!'); // displays message confirming success
            $('#mine-success-img').css('display', 'block'); //reveal success image
            console.log("checkResult=win");
            outcome = "win";
            result (outcome);
            

        } else {
            $('#block-mining-response5').css('color', 'var(--ink10-red)').text('Key Not Accepted');
            $('#block-mining-reattempt').css('display', 'block');
            $('#block-mining-reattempt-count').css('display', 'block');
            
            console.log("checkResult=no win");
            outcome = "no win";
            result (outcome);
        }
        
    }
      
   
    function result(outcome) {
    
        console.log("redirect + outcome", outcome);
        
        //if outcome = no win, display re-attempt message with 3 sec countdown before re-playing gameCycle
        if (outcome == "no win") {
            
            $('#terminal-miner-stopbtn').prop('disabled', true); // BUG : unexpected behaviour if exit btn used during 3 second delay - deactivated for this stage

            let delayTime = 3;    // 3 secs delay
            let repeatInterval = setInterval(function() {

                // actions once time reached
                if (delayTime <=0) {
                    clearInterval(repeatInterval);
                    console.log("3 sec delay completed");
                    $('#block-mining-line5').fadeOut(800);
                    $('#block-mining-response5').fadeOut(800);
                    $('#block-mining-reattempt').fadeOut(800);
                    $('#block-mining-reattempt-count').fadeOut(800).text("0");
                    $('#terminal-miner-stopbtn').prop('disabled', false);
                    gameCycle();            

                // countdown refreshes each second until time reached     
                } else {           
                    $('#block-mining-reattempt-count').text(delayTime);
                }

                delayTime -= 1;
            }, 1000);
                
        }

        // if outcome = win, 3 second pause and display calcResult
        if (outcome == "win") {
            console.log("win?", outcome);
           
           
            $('#block-mining-line2').css('display', 'none');
            $('#block-mining-response2').css('display', 'none');
            $('#terminal-miner-won-btn').css('display', 'block');
            $('#terminal-miner-stopbtn').css('display', 'none');
            $('#block-mining-response1').text("Completed");

            $('#terminal-miner-won-btn').unbind('click').click(function() {
                $('#terminal-miner-won-btn').css('display', 'none');
                calcResult(outcome);
            });

        }

    }
     

    // 10.7 : Calculate Result (1 - costs / power useage, 2 - update stats. 3 - update winnings)

    function calcResult(outcome) {

        // Part 1 - reset fields and buttons
        $('#mining-stats-grid').css('display', 'grid');
        $('#mine-success-img').css('display', 'none');
        $('#terminal-miner-activatebtn').css('display', 'inline-block');
        $('#block-mining-line3').css('display', 'none');
        $('#block-mining-response3').css('display', 'none');
        $('#block-mining-power-used-label').css('display', 'none');
        $('#block-mining-power-used').css('display', 'none');
        $('#block-mining-power-cost-label').css('display', 'none');
        $('#block-mining-power-cost').css('display', 'none');
        $('#block-mining-progressbar').css('display', 'none');
        $('#block-mining-line5').css('display', 'none');
        $('#block-mining-response5').css('display', 'none');
        $('#terminal-miner-upgradebtn').prop('disabled', false);
        $('#terminal-miner-repairbtn').prop('disabled', false);
        $('#energy-btn').prop('disabled', false);


        // Part 2 - calc and deduct power usage
        console.log("deduct power costs here");
        console.log("power usage", totalActiveStats.totalPower);
        console.log("power cost", liveGameData.energy.usageCostPerKw);
        console.log("count", count);
        let powerUsage = totalActiveStats.totalPower;
        let perUnit = liveGameData.energy.usageCostPerKw;
        let unitsUsed = count;
        let totalPowerUsage = powerUsage * unitsUsed;
        let totalPowerCost = totalPowerUsage * perUnit;
        console.log("total power Cost", totalPowerCost);
        let postPowerCosts = liveGameData.finance.bankBalance - totalPowerCost;
        console.log("postPowerCosts", postPowerCosts);
        liveGameData.finance.bankBalance = postPowerCosts;
        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
        //update pollution output 

        let pollutionRate = liveGameData.energy.pollutionRating;
        let pollutionOutput = "";

        if (pollutionRate == "A") {
            pollutionOutput = 0;
        }

        else if (pollutionRate == "B") {
            pollutionOutput = totalPowerUsage / 2;
        }

        else if (pollutionRate == "C") {
            pollutionOutput = totalPowerUsage;
        }
       let newPolOutput = pollutionOutput + liveGameData.stats.pollutionOutput;
       liveGameData.stats.pollutionOutput = newPolOutput;
       $('#stat4-result').html(liveGameData.stats.pollutionOutput + "<span> k/w</span>");
       
        console.log("pol output", pollutionOutput);

         // Part 3 - update stats 
         /*-- temp condition deteriorates by 1 per completed cycle via decrement--*/
         --tempStats.conditionTemp;
         ++liveGameData.stats.blocksAttempted;
         $('#stat1-result').text(liveGameData.stats.blocksAttempted);


         calcTotalActiveStats(); // run to refresh GameCard incl performnce bars

        // Part 4 - calc winnings
 
        if (outcome == "win") {
            
             // add coin to ewallet balance via increment & update stats
             let newCoinBalance = ++ liveGameData.finance.ewalletBalance;
             $('#ewallet-value').text(newCoinBalance);
             console.log(liveGameData.finance.ewalletBalance);
             ++liveGameData.stats.coinsMined; // increment coins mined stat
             $('#stat2-result').text(liveGameData.stats.coinsMined);
             inGameChecks();

        } else if (outcome == "no win") {
            // Part 4 - early exit
            $('#block-mining-line2').css('display', 'none');
            $('#block-mining-response2').css('display', 'none');
            $('#terminal-miner-stopbtn').css('display', 'none');
            $('#block-mining-response1').text("Stopped");
            console.log("no win - early exit");
            inGameChecks();
        }

        console.log("calcResult complete");
        newEvent();
    }      

});

