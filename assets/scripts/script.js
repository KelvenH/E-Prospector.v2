
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
    miningDevices:[                      
    {   device:'Terminal #1',
        purchaseCost: 0,
        chance: 50,
        speed: 1,
        consumption: 10,
        reliability: 100,
        status: 0},
    {   device:'Terminal #2',
        purchaseCost: 10000,
        chance: 40,
        speed: 10,
        consumption: 100,
        reliability: 80,
        status: 0},
    {   device:'Terminal #3',
        purchaseCost: 1000000,
        chance: 25,
        speed: 30,
        consumption: 500,
        reliability: 70,
        status: 0}
]};

//upon player purchasing terminal upgrades, data from the main table will be passed to the 'live' version which becomes the source data for the player to use (i.e. can't 'use' a device which has not been purchased). it also means retaining a devices original stats should future development enable short term changes to the live data (e.g. temporary performance boost);

let liveGameData = {availableMiners:[
    {}
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

$(".activate-miner").click (function () { 
         
        console.log("terminal activated, id=", this.id);    
                                                              //development only - to be removed??
        
        let activeBtn = this.id;                                                    //how to travese the dom from a modal button to the source?
        console.log(activeBtn);
        
        if (activeBtn === actBtn1) {
            console.log("terminal1 activated");
            //terminal 1 actions go here
                
            //update this. terminals .card .styled-pane-card-off to on
            $("#term1-card").removeClass('styled-pane-card-off').addClass('styled-pane-card-on');

            //update this. terminals styled-pane-card-off to on (x 12)
            $("#term1-card").find('.styled-small-off').addClass('styled-small-on').removeClass('styled-small-off');
            $("#term1-card").find('.box').css("background-color","var(--ink6-LED2LOW)");
 
            //update this. terminals status icon to on 
            $("#term1-card").find('.bi-toggle-off').addClass('bi-toggle-on').removeClass('bi-toggle-off');
 
            //update this. terminals btns to btn-on (upgrade & start) and btn-off (disable) activate  - BUG disable status only affects styling, need to add further action to prevent usage
            $("#term1-card").find('.primary').removeClass('btn-off primary').addClass('btn-on btn-primary').prop("disabled", false);
            $("#term1-card").find('.success').removeClass('btn-off success').addClass('btn-on btn-success').prop("disabled", false);
            $("#btn-to-modal-actv1").removeClass('btn-on btn-warning').addClass('btn-off').prop("disabled", true);
            //BUG FIX to prevent re-enacting for the same terminal or skipping to another terminal 
            //remove this terminals activebtn ID and apply ID to terminal 2   
            $("#btn-to-modal-actv1").attr('data-bs-target','#');
            $("#btn-to-modal-actv2").attr('data-bs-target','#modal-activate-miner2');

            //switch activation btn on for next terminal 
            $("#btn-to-modal-actv2").removeClass('btn-off warning').prop("disabled", false).addClass('btn-on btn-warning');

            //run function to feed base data from static mainDataLibrary to liveGameData (fluid version which adjusts according to player actions). 
        
            loadMiner();
         
            //run function to update miner attribute values displayed on screen
 
            //refreshPlayerDashboard();
 
            //update balance function
 
            //updateBalanceAfterPurchase(); 

                // repeat activation sequence for terminals 2 & 3

                } else if (activeBtn === actBtn2) {
                console.log("terminal2 activated");
            
                loadMiner();
        
                //terminal 2 actions go here
                        
                    } else if (activeBtn === actBtn3) {
                    console.log("terminal3 activated");
        
        
                    //terminal 3 actions go here
       
        
        
                    } else {
                    alert("Oops, something's gone wrong! Error : activating terminal");    
                    console.log("alert unrecognised id mapping");
                    } ;
        
        //run function to feed base data from static mainDataLibrary to liveGameData (fluid version which adjusts according to player actions). 
        
        function loadMiner(loadMiner) {                              //loadMiner added in brackets to act as 'call-back' so that this is only run after the above sequence has completed

                let findTerminal = 0;
                
                if (activeBtn === actBtn1) {
                    findTerminal = "Terminal #1";
                    } else if (activeBtn === actBtn2) {
                        findTerminal = "Terminal #2";
                        } else if (activeBtn === actBtn3) {
                            findTerminal = "Terminal #3";
                        } else {
                            alert("Oops, something's gone wrong! Error : refreshing terminal stats");    
                            console.log("alert unrecognised id mapping");
                            } ;

        let item = {device : findTerminal};  
        
        let matchingItem = mainDataLibrary['miningDevices'].filter( (obj) => {   
     
             if(obj.device === item.device){
               
                return true            
                                          
                }
                 return false;
         })
        

                 

                 
        let newStats = {
                device : (matchingItem[0].device),
                consumption : (matchingItem[0].consumption),
                chance : (matchingItem[0].chance),
                speed : (matchingItem[0].speed),
                reliability : (matchingItem[0].reliability),
                status : (matchingItem[0].status),
                 }
        
        
        liveGameData['availableMiners'].push(newStats);
        console.log(liveGameData);
        refreshData();

        }
    
       function refreshData() {
       let t = liveGameData['availableMiners'];
       console.log("t=", t);
       let t1 = t[1].device;
       console.log("t1=", t1);
       let t1Chance = t[1].chance;
       console.log("t1 chance=", t1Chance);
       $("#T1chance").text(t1Chance);
        }
});




    //let resA = (matchingItem[0].device);
    //let resB = (matchingItem[0].consumption);
    //let resC = (matchingItem[0].chance);
    //let resD = (matchingItem[0].speed);
    //let resE = (matchingItem[0].reliability);
    //let resF = (matchingItem[0].status);
       
       //run function to update miner attribute values displayed on screen      
       
        //function refreshPlayerDashboard() {
       // let t1a = liveGameData.availableMiners[0].chance;
       // console.log(t1a);
      //  }



        //update balance function

        //function updateBalanceAfterPurchase();
        //);

 


 

/*- function refreshPlayerDashboard() {
       let term1PurchaseCost = liveGameData.availableMiners[0].purchaseCost;
       let term1Chance = liveGameData.availableMiners[0].chance; 
       let term1Speed = liveGameData.availableMiners[0].speed;
       let term1Consumption = liveGameData.availableMiners[0].consumption;
       let term1Reliability = liveGameData.availableMiners[0].reliability;
       let term1Status = liveGameData.availableMiners[0].status;
       let term2PurchaseCost = liveGameData.availableMiners[1].purchaseCost;
       let term2Chance = liveGameData.availableMiners[1].chance; 
       let term2Speed = liveGameData.availableMiners[1].speed;
       let term2Consumption = liveGameData.availableMiners[1].consumption;
       let term2Reliability = liveGameData.availableMiners[1].reliability;
       let term2Status = liveGameData.availableMiners[1].status;
       let term3PurchaseCost = liveGameData.availableMiners[2].purchaseCost;
       let term3Chance = liveGameData.availableMiners[2].chance; 
       let term3Speed = liveGameData.availableMiners[2].speed;
       let term3Consumption = liveGameData.availableMiners[2].consumption;
       let term3Reliability = liveGameData.availableMiners[2].reliability;
       let term3Status = liveGameData.availableMiners[2].status;
        $("#T1chance").text(term1Chance);

function updateFigs(updateFigs) {
        
        let term1Chance = liveGameData.availableMiners[0].chance; 
        console.log("T1 chance =", term1Chance)
        $("#T1chance").parseInt(term1Chance);
        
        };
       for (

       ) 

       let test1 = liveGameData.availableMiners[0].device;
       console.log(test1);


       let item = {device : Terminal #1};  
        
       let matchingItem = mainDataLibrary['miningDevices'].filter( (obj) => {   



            if(obj.device === item.device){
              
               return true            
                                         
               }
                return false;
        })
       


       let resA = (matchingItem[0].device);
       let resB = (matchingItem[0].consumption);
       --*/









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
