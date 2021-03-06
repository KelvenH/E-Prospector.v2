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
    6.1 - Repair Function

7. Energy;
    A - Display Table
    B - Switch Supplier

8. Events; 
    8.1 - determine if event occurs (1 in 20 chance)
    8.2 - select random event from library
    8.3 - Generate Ouctome for A or B Decision
    8.4 - Update Message Screen and Map Outcome to Respective Actions

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
    10.7 - Calculate Result & Update liveGameData and HTML Values



--------------------------------------------------------------------------------*/


/*-- 1. Utilities--------------------------------------------------------------*/


//  1.1 : Prepare Game After DOM Loaded


document.addEventListener("DOMContentLoaded", function() {

    newGame();
});

// 1.2 : Additional Media Queries (Note: media queries handled in CSS with the exception of the below where change of displayed text required)

if (window.matchMedia("(max-height: 500px)")) {
    $('#exchange-btn').text("Exchange");
    $('#parts-cooling').text("COOLING SYS.");
    $('#parts-software').text("OPERATING SYS.");
    $('#ewallet-label').text("E-Wallet");
    $('#exchange-value-sub').text("(a coin)");
}


/*-- 2. Game Data Tables -----------------------------------------------------*/

// 2.1 : Full Game Library 

const gameLibrary = {
    rigs: [{
        name: "Comm-Atari-ZX",
        cost: 0,
        multiCore: "N",
        baseChance: 10,
        baseHash: 1,
        basePower: 1,
        baseCondition: 20,
        rigComments: "Self-built from re-purposed parts from 1980's tech - hey, it's free?!"
    },
    {
        name: "Bell 200",
        cost: 100,
        multiCore: "N",
        baseChance: 15,
        baseHash: 2,
        basePower: 2,
        baseCondition: 22,
        rigComments: "Upgrade to twice the power (well, 2 x peanuts is still peanuts!)"
    },
    {
        name: "Macro-hard 350+",
        cost: 500,
        multiCore: "N",
        baseChance: 20,
        baseHash: 3,
        basePower: 3,
        baseCondition: 17,
        rigComments: "Not a popular choice - that's for a reason!"
    },
    {
        name: "Dwell Junior",
        cost: 1000,
        multiCore: "N",
        baseChance: 25,
        baseHash: 4,
        basePower: 5,
        baseCondition: 25,
        rigComments: "Once-upon-a-time this was considered a good machine ….once-upon-a-time"
    },
    {
        name: "Orange i-plop",
        cost: 1250,
        multiCore: "N",
        baseChance: 25,
        baseHash: 8,
        basePower: 7,
        baseCondition: 40,
        rigComments: "Unfortunate translation of the model name, but 8-core processor makes this a worthy early consideration"
    },
    {
        name: "Blackbox F-Series",
        cost: 1500,
        multiCore: "Y",
        baseChance: 30,
        baseHash: 4,
        basePower: 25,
        baseCondition: 15,
        rigComments: "Not one knows why, but there seems to be some secret magic with this thing…. when it's not on fire that is!"
    },
    {
        name: "Bell Runner S",
        cost: 2000,
        multiCore: "N",
        baseChance: 35,
        baseHash: 6,
        basePower: 25,
        baseCondition: 35,
        rigComments: "More mid-pack than race winner, but reasonable effort for the top end of the low budget series!"
    },
    {
        name: "Bell Runner S+",
        cost: 3000,
        multiCore: "N",
        baseChance: 35,
        baseHash: 6,
        basePower: 22,
        baseCondition: 35,
        rigComments: "Exactly the same machine, rolled out the following year with a shiny '+' added to the name tag… and a minor power saving"
    },
    {
        name: "Orange i-poop",
        cost: 4500,
        multiCore: "N",
        baseChance: 40,
        baseHash: 8,
        basePower: 25,
        baseCondition: 40,
        rigComments: "Ok, let's forget the model-name, performance exceeds its mid-budget price tag (and with the spare cash you can paint over the name!)"
    },
    {
        name: "Dwell Expert",
        cost: 6000,
        multiCore: "N",
        baseChance: 40,
        baseHash: 4,
        basePower: 20,
        baseCondition: 35,
        rigComments: "Sacrfices speed for power savings. Save the planet or make some money - this Expert thinks you can’t have it both ways."
    },
    {
        name: "Majic My-k",
        cost: 7500,
        multiCore: "N",
        baseChance: 40,
        baseHash: 10,
        basePower: 35,
        baseCondition: 35,
        rigComments: "The sales material reads 'Stripped back for raw, hardcore performance' (not my words, not my words!)"
    },
    {
        name: "Majic My-k Extreme",
        cost: 10000,
        multiCore: "N",
        baseChance: 40,
        baseHash: 15,
        basePower: 40,
        baseCondition: 35,
        rigComments: "Perhaps don’t go google searching this one, let’s just say it comes with a bit more beefed up power and speed."
    },
    {
        name: "Dwell Professional",
        cost: 20000,
        multiCore: "N",
        baseChance: 45,
        baseHash: 20,
        basePower: 40,
        baseCondition: 40,
        rigComments: "Solid machine, solid performance, solid condition…... a solid choice!"
    },
    {
        name: "Orange i-pop",
        cost: 50000,
        multiCore: "N",
        baseChance: 50,
        baseHash: 20,
        basePower: 50,
        baseCondition: 25,
        rigComments: "Ironically for the i-pop this one runs a dream….before well, she 'pops'! Rewards should cover the repairs and keep you in the black."
    },
    {
        name: "Coin - Ripper",
        cost: 70000,
        multiCore: "Y",
        baseChance: 70,
        baseHash: 50,
        basePower: 1500,
        baseCondition: 60,
        rigComments: "More expensive, but the cheapest of the terminals purpose built for crypto-mining. Things are getting serious now!"
    },
    {
        name: "Blackbox X-Series",
        cost: 100000,
        multiCore: "Y",
        baseChance: 80,
        baseHash: 50,
        basePower: 2000,
        baseCondition: 65,
        rigComments: "Blackbox are back again with an improved secret box….. it's black.… ad the rest, well its a secret!"
    },
    {
        name: "Terminus",
        cost: 200000,
        multiCore: "Y",
        baseChance: 90,
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
        code: 1,
        description: "A vulnerability flaw has been exposed in the latest OS update",
        choices: "You can pay £100 fee to download cyber security software or take a risk",
        choiceA: "Option A: Pay £100 for security software",
        choiceB: "Option B: Take a risk that you will not be compromised",
        optA_Safe: "You paid your £100, but could have been worse!",
        optA_Good: "Good news - you paid £100 and the OS release identified efficiencies leading to a temporary 25% performance boost",
        optB_Bad: "Bad news - the head in the sand approach didn't work, hackers managed to access your password and steal 25% of your balance before the bank were able to freeze",
        optB_Neutral: "You were lucky, nothing became of it",
        optB_Great: "Great news! There was no attempted hack of your terminal, and the OS security patch also identified efficiencies leading to a temporary 50% performance boost!"
    },
    {
        title: "Internet Connection Down",
        code: 2,
        description: "Your ISP has taken on too many local customers and impacting connection speed",
        choices: "You can pay £1k to switch to a dedicated fibre or hope things improve",
        choiceA: "Option A: Pay £1k to install fibre",
        choiceB: "Option B: Take a risk things will get better",
        optA_Safe: "You paid £1k, the switchover was otherwise painless",
        optA_Good: "You paid £1k and found that you got a speed boost",
        optB_Bad: "Bad news - your speed has been hit with a speed reduction until your ISP can improve the infrastructure",
        optB_Neutral: "You were lucky, your ISP was quick to improve the infrastructure leading to no impact",
        optB_Great: "Great news! Your ISP installed a new fibre cabinet in your area, you receive a speed boost until they connect other properties"
    },
    {
        title: "Pollution TAX!",
        code: 3,
        description: "To help tackle climate change, the government have announced a new pollution tax",
        choices: "Pay tax of £100 per pollution unit, or refuse to pay in protest",
        choiceA: "Option A: Pay £100 per pollution unit tax",
        choiceB: "Option B: Join the protest",
        optA_Safe: "You pay the tax... ouch!",
        optA_Good: "Pressure mounted and the Tax was reduced to £50 per pollution unit",
        optB_Bad: "Bad news - the government didn't back down and to avoid the threat of court action you were forced to pay the tax and an additional £2k late payment fine",
        optB_Neutral: "Pressure mounted and the new tax was scrapped...... for now!",
        optB_Great: "Great news! Your energy provider misunderstood that they were not meant to pass the tax on to their customers, in addition they pay £2k compensation for the distress caused!"
    },
    {
        title: "What's That Burning Smell?",
        code: 4,
        description: "There's smoke coming from your rig!!",
        choices: "Do you reach for the fire extinguisher or hope switching it off will cool things down",
        choiceA: "Option A: Extinguish the flames",
        choiceB: "Option B: Switch off the power",
        optA_Safe: "You dowse the flames, the rigs not a write-off but you will need to pay for repairs",
        optA_Good: "You extinsguish the flames, luckily your insurance footed the bill but you had to pay £200 premium",
        optB_Bad: "Wow, that took hold quickly! You're rig is a write-off and you need to purchase a new terminal",
        optB_Neutral: "That did the trick... after a cool down you're back up and running",
        optB_Great: "Bad news became great news.... your insurance company sent you a check for £2k but a friend offered to repair it free of charge!"
    },
    {
        title: "Busy Bit Coin Market",
        code: 5,
        description: "There's been a sudden increase mining this crypto-currency",
        choices: "Stick with the crypto-coin and hope things improve or take a chance by switching to a new coin.",
        choiceA: "Option A: Stick with this currency",
        choiceB: "Option B: Switch to a new crypto",
        optA_Safe: "You stick with it, the crowded market leads to a temp reduction to your odds of success",
        optA_Good: "You stick with it, there's a temp reduction to your odds of success but the coin value bumps up",
        optB_Bad: "You make the switch..... unfortunately the new currency is not favoured in the market and the valuation plummets!",
        optB_Neutral: "You make the switch, good move as the market is less crowded and valued the same",
        optB_Great: "You make a move Gordon Gecko would be impressed with. The valuation of this new coin rockets!"
    }
]};

// 2.2 : Live Game Data (initiated with default starting data and ammended through game actions)

const liveGameData = {
    rig: {
        name: "Comm-Atari-ZX",
        cost: 0,
        multiCore: "N",
        baseChance: 10,
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
        bankBalance: 1000,     
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
//BUG - the table is updated but not able to pull this into an if statement when constructing the upgrades template literal
const purchasedRigs = [];
const purchasedProcs = [];
const purchasedCoolSys = [];
const purchasedOpSys = [];


// 2.4 : Temporary Stats (captures short-term pos / neg impacts typically as a result of events)

const tempStats = {
    chanceTemp: 0,      
    hashPowerTemp: 0,   
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

/*-- 3. Update Game Card  -----------------------------------------------------*/

// 3.1 : Load Base Game data and update initial text on html page  

function newGame() {
    
    // load default miner //
    const miner = liveGameData.rig;
    const parts = liveGameData.parts;
    const minerProcessor = parts[0].processor;
    const minerCoolSys = parts[0].coolingSystem;
    const minerOpSys = parts[0].operatingSystem;

    $("#rig-name").text(miner.name);
    $("#processor-name").text(minerProcessor.name);
    $("#cooling-name").text(minerCoolSys.name);
    $("#software-name").text(minerOpSys.name);
   
    // load default energy //
    const energy = liveGameData.energy;
    $("#provider-response").text(energy.provider);
    $("#type-response").text(energy.type);
    $("#cost-response").text(energy.usageCostPerKw);
    $("#reliability-response").text(energy.reliability);
    $("#pollution-rating-response").text(energy.pollutionRating);
    $("#statement").text(energy.comments);

    // load default finance - note approach to update the second [1] value to prevent overwriting the span (£) //
    const finance = liveGameData.finance;
    $("#bank-value").contents()[1].nodeValue = finance.bankBalance;

    // load initial stats
    const stats = liveGameData.stats;
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
    const base = liveGameData.rig;
    const proBuff = liveGameData.parts[0].processor;
    const coolBuff = liveGameData.parts[0].coolingSystem;
    const osBuff = liveGameData.parts[0].operatingSystem;
    const temp = tempStats;

    // sum total by applying temp stats to liveGameData, where relevent also round values to nearest whole number and cap max value at 100
    
    // Chance
    let ChanceTotal = (Math.round(base.baseChance + (base.baseChance / 100 * (proBuff.chanceBuff + coolBuff.chanceBuff + osBuff.chanceBuff + temp.chanceTemp))));

    if (ChanceTotal > 100) {
        total.totalChance = 100;
    } else {
        total.totalChance = ChanceTotal;
    }
    $("#chance-value").text(total.totalChance);
    
    // Hash Rate 
    HashTotal = (Math.round(base.baseHash + (base.baseHash / 100 * (proBuff.hashPowerBuff + coolBuff.hashPowerBuff + osBuff.hashPowerBuff + temp.hashPowerTemp))));
    if (HashTotal > 100) {
        total.totalHash = 100;
    } else {
        total.totalHash = HashTotal;
    }
    $("#speed-value").text(total.totalHash);
    
    // Power Useage (note: no cap on power usage)
    total.totalPower = (Math.round(base.basePower + (base.basePower / 100 * (proBuff.powerBuff + coolBuff.powerBuff + osBuff.powerBuff + temp.pwrUsageTemp))));
    $("#power-value").text(total.totalPower);
    
    // Condition
    ConditionTotal = (Math.round(base.baseCondition + (base.baseCondition / 100 * (proBuff.conditionBuff + coolBuff.conditionBuff + osBuff.conditionBuff + temp.conditionTemp))));
    if (ConditionTotal > 100) {
        total.totalCondition = 100;
    } else if (ConditionTotal < 0) {
        total.totalCondition = 0;            // prevent performance deteriorating below zero
    } else {
        total.totalCondition = ConditionTotal;
    }

    $("#condition-value").text(total.totalCondition);

    // change status if condition reaches zero

    if (total.totalCondition == 0) {
        liveGameData.rig.status = "Unavailable";
    }


    refreshPerformanceBars();

}


// 3.3 : Refresh Performance Bars 

function refreshPerformanceBars() {

    const maxValue = 100;
    const total = totalActiveStats;

    const chanceProgress = total.totalChance;
    const w = (chanceProgress / maxValue) * 100;
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


    if (total.totalCondition < 20) {
        $("#condition-meter-bar").css("background-color", "var(--ink10-red)");
    } else if (total.totalCondition < 40) {
        $("#condition-meter-bar").css("background-color", "var(--ink11-amber)");
    } else {
        $("#condition-meter-bar").css("background-color", "var(--ink12-green)");
    }
}

/*-- 4. In Game Checks  (function called prior to running game cycle and after)--*/

function inGameChecks() {
    // 4.1 :  Finance checks 
        
    // Game Over
    if ((liveGameData.finance.bankBalance < 1) && (liveGameData.finance.ewalletBalance < 1)) {
        $('#modal-gameover').modal('show');
       
        $("#game-over-btn").unbind('click').click(function() {
            location.reload();
        });
        return; //prevent function from progressing with gamecycle

    // No funds but has crypto-coin to exchange
    } else if ((liveGameData.finance.bankBalance < 1) && (liveGameData.finance.ewalletBalance > 0)) {
        $('#modal-no-funds').modal('show');
      
        $("#no-funds-btn").unbind('click').click(function() {
            $('#modal-no-funds').modal('hide');
        });
        return; //prevent function from progressing with gamecycle
    }

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
    
        $("#unavailable-btn").unbind('click').click(function() {
            $('#modal-unavailable').modal('hide');
        });
        return; //prevent function from progressing with gamecycle
    }
                  

} // end game checks


/*-- 5. Upgrades  -----------------------------------------------------*/

// 5.1 : Display Upgrade Modal

$("#terminal-miner-upgradebtn").click(function() {
    $('#modal-upgrades').modal('show');
    
    // 5.2 : Upgrade Rig 

    // A: Display Table
    $("#upgrade-rigs-tab").click(function() {

        let rigs = gameLibrary.rigs;
    
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
        
            let name = selectedRig[0].innerHTML;
            let cost = parseFloat(selectedRig[1].innerHTML);
            let chance = parseFloat(selectedRig[2].innerHTML);
            let hash = parseFloat(selectedRig[3].innerHTML);
            let power = parseFloat(selectedRig[4].innerHTML);
            let condition = parseFloat(selectedRig[5].innerHTML);
            let comments = selectedRig[6].innerHTML;
            
            
            /*--check able to afford, if able to afford run purchaseRig, else display message with current balance --*/

            let price = cost;
        
            let currentBal = liveGameData.finance.bankBalance;
                    
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
            
                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            } else {
                purchaseRig();
            }

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
                purchasedRigs.push(name);
                
                /*--deduct costs (calculate, update liveGameData and display to page)--*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
               
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
           
            let name = selectedProc[0].innerHTML;
            let cost = parseFloat(selectedProc[1].innerHTML);
            let chance = parseFloat(selectedProc[2].innerHTML);
            let hash = parseFloat(selectedProc[3].innerHTML);
            let power = parseFloat(selectedProc[4].innerHTML);
            let condition = parseFloat(selectedProc[5].innerHTML);
            
                       
            /*--check able to afford, if able to afford run purchaseProc, else display message with current balance --*/

            let price = cost;
            let currentBal = liveGameData.finance.bankBalance;
          
            
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
               
                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            }

            else {
                purchaseProc();
            }

            /*--function to purchase processor---*/

            function purchaseProc() {

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
                purchasedProcs.push(name);

                /*--deduct costs (calculate, update liveGameData and display to page) --*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

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

        let name = selectedCool[0].innerHTML;
        let cost = parseFloat(selectedCool[1].innerHTML);
        let chance = parseFloat(selectedCool[2].innerHTML);
        let hash = parseFloat(selectedCool[3].innerHTML);
        let power = parseFloat(selectedCool[4].innerHTML);
        let condition = parseFloat(selectedCool[5].innerHTML);
        
                    
        /*--check able to afford, if able to afford run purchaseCool, else display message with current balance --*/

        let price = cost;

        let currentBal = liveGameData.finance.bankBalance;
        
        if (price > currentBal) {
            $('#modal-unaffordable').modal('show');
            $('#unaffordable-balance').text(currentBal);

            $("#unaffordable-exit-btn").click(function() {
                $('#modal-unaffordable').modal('hide');
            });
        
        }

        else {
            purchaseCool();
        }

        /*--function to purchase cooling system---*/

        function purchaseCool() {

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
            purchasedCoolSys.push(name);

            /*--deduct costs (calculate, update liveGameData and display to page) --*/
            newBalance = liveGameData.finance.bankBalance - cost;
            liveGameData.finance.bankBalance = newBalance;
            $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

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
    
            /*--create temp array to pull innerhtml values--*/
            let name = selectedOs[0].innerHTML;
            let cost = parseFloat(selectedOs[1].innerHTML);
            let chance = parseFloat(selectedOs[2].innerHTML);
            let hash = parseFloat(selectedOs[3].innerHTML);
            let power = parseFloat(selectedOs[4].innerHTML);
            let condition = parseFloat(selectedOs[5].innerHTML);
            
                        
            /*--check able to afford, if able to afford run purchaseOpSys, else display message with current balance --*/
    
            let price = cost;
    
            let currentBal = liveGameData.finance.bankBalance;
            
            if (price > currentBal) {
                $('#modal-unaffordable').modal('show');
                $('#unaffordable-balance').text(currentBal);
    
                $("#unaffordable-exit-btn").click(function() {
                    $('#modal-unaffordable').modal('hide');
                });
            
            }
    
            else {
                purchaseOpSys();
            }
    
            /*--function to purchase Operating System---*/
    
            function purchaseOpSys() {
       
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
                purchasedOpSys.push(name);
    
                /*--deduct costs (calculate, update liveGameData and display to page) --*/
                newBalance = liveGameData.finance.bankBalance - cost;
                liveGameData.finance.bankBalance = newBalance;
                $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
    
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
//Note: step 3.2 (CalcTotalActiveStats) identifies if condition = 0 and changes status to Unavailable, step 4.2 (inGameChecks Miner : Status) prevents play continuing if repair required

// 6.1 - Repair Function

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
   
    let providers = gameLibrary.energy;

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

        let provider = selectedProvider[0].innerHTML;
        let cost = parseFloat(selectedProvider[1].innerHTML);
        let type = selectedProvider[2].innerHTML;
        let useage = parseFloat(selectedProvider[3].innerHTML);
        let reliability = selectedProvider[4].innerHTML;
        let pollution = selectedProvider[5].innerHTML;
        let comments = selectedProvider[6].innerHTML;
    
        /*--check able to afford, if able to afford run chooseSupplier, else display message with current balance --*/

        let price = cost;

        let currentBal = liveGameData.finance.bankBalance;
        
        if (price > currentBal) {
            $('#modal-energy').modal('hide');
            $('#modal-unaffordable').modal('show');
            $('#unaffordable-balance').text(currentBal);

            $("#unaffordable-exit-btn").click(function() {
                $('#modal-unaffordable').modal('hide');
            });

        } else {
            chooseSupplier();
        }

        /*--function to change supplier---*/

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

           
            /*--redirect after purchase (close modal)--*/
            $('#modal-energy').modal('hide');

        } // end of change supplier function
    });
});


/*-- 8. Events -------------------------------------------------------------*/

// 8.1 : Determine if event occurs
function newEvent() {
    let eventHappen = Math.floor(Math.random() * 20); // generate no. 0 - 19 
    
    //1 in 20 chance of event occuring prevents occuring too frequently
    if (eventHappen == 1) {                                                       
        //disable other functional buttons to prevent unexpected behaviour
        $('#terminal-miner-upgradebtn').prop('disabled', true);
        $('#terminal-miner-repairbtn').prop('disabled', true);
        $('#energy-btn').prop('disabled', true);
        $('#terminal-miner-activatebtn').prop('disabled', true);

        // 8.2 : Random event selection
        let eventBank = gameLibrary.events;
        let randomEvent = eventBank[Math.random() * eventBank.length | 0]; //random selection from events array

        let randomTitle = randomEvent.title;
        let eventCode = randomEvent.code;
        let randomDescription = randomEvent.description;
        let randomChoices = randomEvent.choices;
        let randomChoiceA = randomEvent.choiceA;
        let randomChoiceB = randomEvent.choiceB;
        let optA_Safe = randomEvent.optA_Safe;
        let optA_Good = randomEvent.optA_Good;
        let optB_Bad = randomEvent.optB_Bad;
        let optB_Neutral =  randomEvent.optB_Neutral;
        let optB_Great =  randomEvent.optB_Great;
        let finalOutcome = "";
        
        $('#msg-event').css('display', 'block').text(randomDescription);
        $('#msg-alert').css('display', 'block');
        $('#msg-title').css('display', 'block').text(randomTitle);
        $('#msg-choices').css('display', 'block').text(randomChoices);
        
        // media query to only show title and description on larger screens (Note there is no event listener so only applies when loading as opposed to manual resizing of the browser but viewed acceptable given this is for small screens)
        let mediaQuery = window.matchMedia('(max-height: 400px)');
        if (mediaQuery.matches) {
            $('#message-screen').css('line-height', '10px');
            $('#msg-alert').css('display', 'none');
            $('#msg-title').css('display', 'none');
            $('#msg-choices').css('display', 'none');
        }

        $('#msg-optA-txt').css('display', 'block').text(randomChoiceA);
        $('#msg-optB-txt').css('display', 'block').text(randomChoiceB);
        $('#msg-btn-optA').css('display', 'block');
        $('#msg-btn-optB').css('display', 'block');

        // 8.3 : Generate Ouctome for A or B Decision
        $('#msg-btn-optA').unbind('click').click(function(finalOutcome) {
            optionSelected();
            //option A - 90% 'safe' option, 10% good news
            let outcomeA = Math.floor(Math.random() * 10);  // random number 0 - 9

            if (outcomeA <= 8) {                
                finalOutcome = optA_Safe;
                eventResult (finalOutcome);
            }  
            else if (outcomeA = 9) {            
                finalOutcome = optA_Good;
                eventResult (finalOutcome);
            }  

        });

        $('#msg-btn-optB').unbind('click').click(function(finalOutcome) {
            optionSelected();
            //option B - 50% 'bad bews', 40% 'neutral', 10% 'great news'
            let outcomeB = Math.floor(Math.random() * 10);  // random number 0 - 9

            if (outcomeB <= 4) {
                finalOutcome = optB_Bad;
                eventResult (finalOutcome);
            }  
            else if (outcomeB > 4 && outcomeB < 9) {
                finalOutcome = optB_Neutral;
                eventResult (finalOutcome);
            }
            else if (outcomeB == 9) {
                finalOutcome = optB_Great;
                eventResult (finalOutcome);
            }  

        });
        
        // 8.4 : Update Message Screen and Map Outcome to Respective Actions
        function eventResult (finalOutcome) {
            $('#msg-outcome-txt').css('display', 'block').text(finalOutcome);
            $('#msg-btn-outcome').css('display', 'block');
            $('#msg-btn-outcome').unbind('click').click(function() {
                
                $('#msg-alert').fadeOut(800);
                $('#msg-title').fadeOut(800);
                $('#msg-outcome-txt').fadeOut(800);
                $('#msg-btn-outcome').fadeOut(800);
                $('#terminal-miner-upgradebtn').prop('disabled', false);
                $('#terminal-miner-repairbtn').prop('disabled', false);
                $('#energy-btn').prop('disabled', false);
                $('#terminal-miner-activatebtn').prop('disabled', false);

                if (finalOutcome == optA_Safe) {

                    if (eventCode == 1) {
                        // deduct £100 from balance
                        let penalty = 100;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 2) {
                        // deduct £1k balance
                        let penalty = 1000;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 3) {
                        // deduct £100 per pollution unit
                        let pollutionOutput = liveGameData.stats.pollutionOutput;
                        let tax = 100 * pollutionOutput;
                        let newBalance = liveGameData.finance.bankBalance - tax;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 4) {
                        // put rig temp condition as - 1000 (this forces the totalActive condition to be 0 and can be restored by using repairs)
                        tempStats.conditionTemp = -1000;
                        calcTotalActiveStats();

                    } else if (eventCode == 5) {
                        // slight temp reduction to chance
                        tempStats.chanceTemp = tempStats.chanceTemp - 20;
                        calcTotalActiveStats();
                    } 

                } else if (finalOutcome == optA_Good) {
                    if (eventCode == 1) {
                        // deduct £100 from balance & temp speed boost 25%
                        let penalty = 100;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                        tempStats.hashPowerTemp = tempStats.hashPowerTemp + 25;
                        calcTotalActiveStats();

                    } else if (eventCode == 2) {
                        // deduct £1k from balance & speed boost 25%
                        let penalty = 1000;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;
                        tempStats.hashPowerTemp = tempStats.hashPowerTemp + 25;
                        calcTotalActiveStats();


                    } else if (eventCode == 3) {
                        // deduct £50 per pollution unit
                        let pollutionOutput = liveGameData.stats.pollutionOutput;
                        let tax = 50 * pollutionOutput;
                        let newBalance = liveGameData.finance.bankBalance - tax;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 4) {
                        // deduct £200 from bank balance
                        let penalty = 200;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 5) {
                        //  slight reduction to chance + increase to coin FX value
                        tempStats.chanceTemp = tempStats.chanceTemp - 20;
                        let currentExRate = liveGameData.finance.fxRate;
                        let newRate = currentExRate - 100;
                        liveGameData.finance.fxRate = newRate.toFixed(2);
                        $("#exchange-value").contents()[1].nodeValue = liveGameData.finance.fxRate;

                        calcTotalActiveStats();

                    } 

                } else if (finalOutcome == optB_Bad) {
                    if (eventCode == 1) {
                        // deduct 25% bank balance
                        let currentBalance = liveGameData.finance.bankBalance;
                        let penalty = currentBalance / 4;
                        let newBalance = liveGameData.finance.bankBalance - penalty;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 2) {
                        // 50% speed reduction
                        tempStats.hashPowerTemp = tempStats.hashPowerTemp - 50;
                        calcTotalActiveStats();

                    } else if (eventCode == 3) {
                        // deduct £2k fine + £100 per pollution unit
                        let penalty = 2000;

                        let pollutionOutput = liveGameData.stats.pollutionOutput;
                        let tax = 100 * pollutionOutput;
                        
                        let newBalance = liveGameData.finance.bankBalance - (penalty + tax);
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 4) {
                        // remove terminal from current game library
                        liveGameData.rig.name = "";
                        liveGameData.rig.cost = "";
                        liveGameData.rig.baseChance = 0;
                        liveGameData.rig.baseHash = 0;
                        liveGameData.rig.basePower = 0;
                        liveGameData.rig.baseCondition = 0;
                        liveGameData.rig.rigComments = "";
                        liveGameData.rig.status = "Unavailable";


                    } else if (eventCode == 5) {
                        // significant decrease to coin FX value
                        let currentExRate = liveGameData.finance.fxRate;
                        let newRate = currentExRate - 250;
                        liveGameData.finance.fxRate = newRate.toFixed(2);
                        $("#exchange-value").contents()[1].nodeValue = liveGameData.finance.fxRate;

                    } 

                // No function if finalOutcome == optB_Neutral as no impact from event 

                } else if (finalOutcome == optB_Great) {
                    if (eventCode == 1) {
                        // add speed boost 50%
                        tempStats.hashPowerTemp =  tempStats.hashPowerTemp + 50;
                        calcTotalActiveStats();

                    } else if (eventCode == 2) {
                        // add temp speed boost 50%
                        tempStats.hashPowerTemp = tempStats.hashPowerTemp + 50;
                        calcTotalActiveStats();

                    } else if (eventCode == 3) {
                        // increase bank balance by £2k
                        let reward = 2000;
                        let newBalance = liveGameData.finance.bankBalance + reward;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 4) {
                        // increase bank balance by £2k
                        let reward = 2000;
                        let newBalance = liveGameData.finance.bankBalance + reward;
                        liveGameData.finance.bankBalance = newBalance;
                        $("#bank-value").contents()[1].nodeValue = liveGameData.finance.bankBalance;

                    } else if (eventCode == 5) {
                        // significant increase to coin FX value
                        let currentExRate = liveGameData.finance.fxRate;
                        let newRate = currentExRate + 250;
                        liveGameData.finance.fxRate = newRate.toFixed(2);
                        $("#exchange-value").contents()[1].nodeValue = liveGameData.finance.fxRate;
                    } 

                } 

            });
        }

    }
   
}


function optionSelected() {
        $('#msg-event').fadeOut(800);
        $('#msg-choices').fadeOut(800);
        $('#msg-optA-txt').fadeOut(800);
        $('#msg-optB-txt').fadeOut(800);
        $('#msg-btn-optA').fadeOut(800);
        $('#msg-btn-optB').fadeOut(800);
}


/*-- 9. Crypto-Coin Exchange -----------------------------------------------*/

// 9.1 : Calculate a moving exchange rate every 30 seconds 

let currentExRate = liveGameData.finance.fxRate;
let exInterval = setInterval(update, 30000); //30,000 = 30 secs 

function update () {
    let num = Math.random(); //generates a random float value (0 - 1)
    num *= Math.round(Math.random()) ? 1 : -1; // randomly determines a positive or negative value [Acknowledgement to online post: https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value]
    
    let movingRate = num / 10; // caps range of movement between -10% and +10% 
    
    let newRate = currentExRate + (currentExRate * movingRate); // calculates rate move against existing exchnage rate
    liveGameData.finance.fxRate= newRate.toFixed(2); // updates gameLibrary with new exchnage rate fixed to 2 decimal places
    $("#exchange-value").contents()[1].nodeValue = liveGameData.finance.fxRate; // updates value displayed on screen
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

    // 10.1 : Deactivate Repair, Upgrade and Energy Buttons (Bug Fix : unexpected behaviour encountered if changes made during gameplay)

    $('#terminal-miner-upgradebtn').prop('disabled', true);
    $('#terminal-miner-repairbtn').prop('disabled', true);
    $('#energy-btn').prop('disabled', true);

    // 10.2 : Pre-Game Checks    
    inGameChecks();

    // 10.3 : Generate Device and Block Keys 

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

    //create array with all values within the keyRange - purpose is to cross referrence after minerKey checked and prevent re-selecting the same ID
    let keyStart = 1;
    let keyMax = keyRange;
    let allKeys = [];

    while (keyStart <= keyMax) {
        allKeys.push(keyStart++);
    }
 
    //generate blockKey which is limited to the pre-defined keyRange
    let blockKey = 0;
    generateBlockKey(blockKey);

    function generateBlockKey() {
        blockKey = Math.floor(Math.random() * keyRange) + 1;
        if (blockKey > keyRange) {
            alert("Error: BlockKey is out of range, please re-click to mine block!"); // BUG experienced in development, should not be enouncountered now min floor value assigned but retained in case of unexpected behaviour through events / buffs 
        } 
        return blockKey;
    }

    //generate minerKey which is limited to the pre-defined keyRange
    let minerKey = 0;

    function generateMinerKey() {
        
        minerKey = Math.floor(Math.random() * allKeys.length +1); // random selection from the array of keyRange
        
        // find the random chosen key and remove from array to prevent re-selection 
        let index = allKeys.indexOf(minerKey);
        if (index > -1) {
            allKeys.splice(index, 1);
        }

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
    let maxCounter = 10; // maximum (unbuffed) speed of 10secs to mine block
    let buffedSpeed = maxCounter - (maxCounter * hashSpeed); //reduces the maxValue according to the total hashSpeed buff

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
                ++count;
                $('#block-mining-response3').html(count);

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
            } 
            timeleft -= 0.5;
        }, 500);
    }

    // 10.6 : Check Result (determines if success / fail messages, buttons and redirects to display)

    let outcome = "";

    function checkResult(minerKey, blockKey) {
        if (minerKey === blockKey) {

            $('#block-mining-response5').text('Success, block mined!'); // displays message confirming success
            $('#mine-success-img').css('display', 'block'); //reveal success image
            outcome = "win";
            result (outcome);
            

        } else {
            $('#block-mining-response5').css('color', 'var(--ink10-red)').text('Key Not Accepted');
            $('#block-mining-reattempt').css('display', 'block');
            $('#block-mining-reattempt-count').css('display', 'block');
            outcome = "no win";
            result (outcome);
        }
        
    }
      
   
    function result(outcome) {
        
        //if outcome = no win, display re-attempt message with 3 sec countdown before re-playing gameCycle
        if (outcome == "no win") {
            
            $('#terminal-miner-stopbtn').prop('disabled', true); // BUG : unexpected behaviour if exit btn used during 3 second delay - deactivated for this stage

            let delayTime = 3;    // 3 secs delay
            let repeatInterval = setInterval(function() {

                // actions once time reached
                if (delayTime <=0) {
                    clearInterval(repeatInterval);
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

        let powerUsage = totalActiveStats.totalPower;
        let perUnit = liveGameData.energy.usageCostPerKw;
        let unitsUsed = count;
        let totalPowerUsage = powerUsage * unitsUsed;
        let totalPowerCost = totalPowerUsage * perUnit;
        let postPowerCosts = liveGameData.finance.bankBalance - totalPowerCost;
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
             ++liveGameData.stats.coinsMined; // increment coins mined stat
             $('#stat2-result').text(liveGameData.stats.coinsMined);
             inGameChecks();

        } else if (outcome == "no win") {
            // Part 4 - early exit
            $('#block-mining-line2').css('display', 'none');
            $('#block-mining-response2').css('display', 'none');
            $('#terminal-miner-stopbtn').css('display', 'none');
            $('#block-mining-response1').text("Stopped");
            inGameChecks();
        }

        newEvent();
    }      

});
