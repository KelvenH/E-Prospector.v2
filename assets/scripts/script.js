
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
//-------------------------------------------------------------------------------*/

//Mining devices;

/*---
[1]name            [2]purchaseCost   [3]minerPowerConsumption    [4]minerChance   [5*]speed (timer) [6*]reliability  [7i]status
Level 0 (Default)       0                10                         25              0               100             1
Level 1                 50               25                         20              0               100             0
Level 2                 250              50                         15              0               100             0
Level 3                 500              150                        10              0               100             0  
Level 4                 1000             250                        2               0               100             0

[1] - [6] : displayed to user in device information   +   upgrade shop
[7] : hidden from user 
[**] - not invoked for baseline version but planned for future enhancement
[i] - status, 0 = not available (i.e. not purchased), 1 = available (default or purchased) 
----*/


let mainDataLibrary = {
    miningDevices:[                      // further items to be added to the data tables as developed e.g. variable power costs
    {   device:'Terminal #1',
        purchaseCost: 0,
        chance: 50,
        speed: 1,
        consumption: 10,
        reliability: 100,
        status: 1},
    {   device:'Terminal #2',
        purchaseCost: 100,
        chance: 50,
        speed: 1,
        consumption: 10,
        reliability: 100,
        status: 0},
    {   device:'Terminal #3',
        purchaseCost: 250,
        chance: 50,
        speed: 1,
        consumption: 10,
        reliability: 100,
        status: 0}
]};

//upon player purchasing terminal upgrades, data from the main table will be passed to the 'live' version which becomes the source data for the player to use (i.e. can't 'use' a device which has not been purchased). it also means retaining a devices original stats should future development enable short term changes to the live data (e.g. temporary performance boost);

let liveGameData = {availableMiners:[
    {   device : 'Terminal #1',
        consumption : 10,
        chance : 25,
        speed : 0,
        reliability : 100,
        status : 1},
]};

   
/*---------------------------------------------------------------------------------
//  1.0 Prepare Game On DOM Load;
//      Wait until DOM loaded then obtain miner details from 'liveGameData' (default only available at start)
//      Data used to populate the HTML fields (dropdown menu, and performance stats)
//-------------------------------------------------------------------------------*/



document.addEventListener("DOMContentLoaded", function () {             // Waits for the DOM to load before executing the initial game prep

 
        console.log("DOM load complete");                               // end of onload function
    });

//update miner stats 'in-play' after selection of device (function can be accessed at any time outside of 'mine block'game cycle)



/*---------------------------------------------------------------------------------
//   2a. Activate Miner; (player activates via modal handled by Bootstrap modal)
        i - device status changed (mainDataLibrary) indicating miner now activate
        ii- action player purchase (update balance script)
        iii - device status changed (switch status icon / color, change panel classes to apply 'on' styles)
        iv - activate terminal buttons (upgrade / play) by removing disabled status
        v - enable 'activate terminal for next terminal) - only applic to term 1 and 2
//-------------------------------------------------------------------------------*/

let term1 = document.getElementById("terminal1");
let term2 = document.getElementById("terminal2");
let term3 = document.getElementById("terminal3");

let actBtn1 = "btn-activation1";
let actBtn2 = "btn-activation2";
let actBtn3 = "btn-activation3";

$(".activate-miner").click (function () { 
         
        console.log("terminal activated, id=", this.id);    
                                                              //development only - to be removed??
        
        let activeBtn = this.id;                                                    //how to travese the dom from a modal button to the source?
        console.log(activeBtn);
        
        if (activeBtn === actBtn1) {
            console.log("terminal1 activated");
            //terminal 1 actions go here
        }


        else {
            console.log("alert unrecognised id mapping");
        } ;

        //add an if statement to match source to response? For now create 3 times for each button

        //update game data - 'update status' and pull all matched fields to live game data
        
        
        
        //let txt = document.getElementsByClassName("device-name").value;
        //console.log(txt);




        //update balance function

        //update this. terminals .card .styled-pane-card-off to on
        $("#term1-card").removeClass('styled-pane-card-off').addClass('styled-pane-card-on');

        //update this. terminals styled-pane-card-off to on (x 12)
        $("#term1-card").find('.styled-small-off').addClass('styled-small-on').removeClass('styled-small-off');

        //update this. terminals icon to on 
        $("#term1-card").find('.bi-toggle-off').addClass('bi-toggle-on').removeClass('bi-toggle-off');

        //update this. terminals btns to btn-on (upgrade & start) and btn-off (disable) activate
        $("#term1-card").find('.primary').removeClass('btn-off primary').addClass('btn-on btn-primary').prop("disabled", false);
        $("#term1-card").find('.success').removeClass('btn-off success').addClass('btn-on btn-success').prop("disabled", false);
        $("#btn-to-modal-actv1").removeClass('btn-on btn-warning').addClass('btn-off').prop("disabled", true);


        //populate attribute values (fed from live game data refresh)
        //append to below - low power mode 
        $("#term1-card").find('.box').css("background-color","var(--ink6-LED2LOW)");
        
        //switch activation btn on for next terminal 
        $("#btn-to-modal-actv2").removeClass('btn-off warning').prop("disabled", false).addClass('btn-on btn-warning');

    });

//bug - diabled attribute does not prevent link from working - look at changing to button instead??



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
//   3. (not in baseline) changes to power source / cost rate 
//-------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------
//   4. Run Game (event = player clicks to run new round);
        a - game generates device and block keys (linked to active device probability range) 
        b - checks if match 
        c - calc outcome,subTotal (last balance + winnings - costs); 
            i) associated power costs (power consumpation x power unit rate)
            ii) winnings (if keys match)
        d - update current balance (last balance + round subTotal)
//-------------------------------------------------------------------------------*/

// Run Game - Event listener for run game button (initiate game cycle stages)

//let play = document.getElementById('btn-play');
//play.addEventListener('click', mineBlock);


// BUG / DEFECT - if player does not select a miner there is a 1 in 1 chance of 0 = 0 i.e. win evey time!, either add check (with alert) to prevent game from progressing and / or Jquery event on 'play' button so as button deactivated / hidden unt selection made.

    
    // Game stage Ai - generate miner ID / Key and display in Game Panel  
    


    // Game Stage C - Calculate Outcome 



    

   // Game stage D - Update Balance 
        


    //The following functions are called in the above Run Game cycle if condition(s) met

    // Game Stage Ci - Calculate costs


        
        
      // Game Stage Cii - Calculate win



/*---------------------------------------------------------------------------------
//   5. Events (not in baseline)
//-------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------
//   6. X-change (not in baseline)
//-------------------------------------------------------------------------------*/
