
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


let liveGameData = {availableMiners:[
    {}
]};

loadMiner();

function loadMiner(loadMiner) {

let activeBtn = "btn-activation1";
    
let actBtn1 = "btn-activation1";
let actBtn2 = "btn-activation2";
let actBtn3 = "btn-activation3";

let findTerminal = 0;

if (activeBtn === actBtn1) {
    findTerminal = "Terminal #1";
    } else if (activeBtn === actBtn2) {
    findTerminal = "Terminal #2";    
    }
    console.log(findTerminal);

  

let item = {device : findTerminal};  
   
let matchingItem = mainDataLibrary['miningDevices'].filter( (obj) => {   

        if(obj.device === item.device){
            return true
        }
            return false;
    })
  
let resA = (matchingItem[0].device);
let resB = (matchingItem[0].consumption);
let resC = (matchingItem[0].chance);
let resD = (matchingItem[0].speed);
let resE = (matchingItem[0].reliability);
let resF = (matchingItem[0].status);

//console.log('device', resA);
//console.log('consumption', resB);
//console.log('chance', resC);
//console.log('speed', resD);
//console.log('reliability', resE);
//console.log('status', resF);

let newStats = {
    device : (matchingItem[0].device),
    consumption : (matchingItem[0].consumption),
    chance : (matchingItem[0].chance),
    speed : (matchingItem[0].speed),
    reliability : (matchingItem[0].reliability),
    status : (matchingItem[0].status),
}

console.log("live data2", liveGameData);   
liveGameData['availableMiners'].push(newStats); 
console.log("live data3", liveGameData);     
};




////////////////////////////////////////////////////////////////


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


let liveGameData = {availableMiners:[
    {}
]};


let actBtn1 = "btn-activation1";
let actBtn2 = "btn-activation2";
let actBtn3 = "btn-activation3";

function (update) { 
         
               
        let activeBtn = "btn-activation1";                       
        console.log(activeBtn);
        
        if (activeBtn === actBtn1) {
            console.log("terminal1 activated");
           
            loadMiner();
         
            } else if (activeBtn === actBtn2) {
                console.log("terminal2 activated");
            
                loadMiner();
                        
                    } else if (activeBtn === actBtn3) {
                    console.log("terminal3 activated");
                
                    } else {
                    alert("Oops, something's gone wrong! Error : activating terminal");    
                    console.log("alert unrecognised id mapping");
                    } ;
        
        
        function loadMiner(loadMiner) {                              
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
        
        let resA = (matchingItem[0].device);
        let resB = (matchingItem[0].consumption);
        let resC = (matchingItem[0].chance);
        let resD = (matchingItem[0].speed);
        let resE = (matchingItem[0].reliability);
        let resF = (matchingItem[0].status);
                 
                
        let newStats = {
                device : (matchingItem[0].device),
                consumption : (matchingItem[0].consumption),
                chance : (matchingItem[0].chance),
                speed : (matchingItem[0].speed),
                reliability : (matchingItem[0].reliability),
                status : (matchingItem[0].status),
                 }
        
        console.log("live data3", liveGameData); 
        liveGameData['availableMiners'].push(newStats);
        updateFigs()
    }};

        function updateFigs(updateFigs) {
        
        let term1Chance = liveGameData.availableMiners[0].chance; 
        console.log("T1 chance =", term1Chance)
        //$("#T1chance").text(term1Chance);
        
        };
       
                
       

        //update balance function

        //function updateBalanceAfterPurchase();


 


 //run function to update miner attribute values displayed on screen

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


