



let liveGameData = {availableMiners:[
    {   device : 'Terminal #1',
        consumption : 10,
        chance : 25,
        speed : 0,
        reliability : 100,
        status : 1},
        {device : 'Terminal #2',
        consumption : 100,
        chance : 250,
        speed : 0,
        reliability : 100,
        status : 1},
]};




let newGameData = {newMiners:[
    {   },
]};



   let txt = "Terminal #2"     
   

   let item = {device : txt};  
   
                                                         

    let matchingItem = liveGameData['availableMiners'].filter( (obj) => {   

        if(obj.device === item.device){
            return true;
        }
            return false;
    })
  

//let resA = 0;                                                          
// let resB = 0;                                                          
// let resP = 1;    


    //resA = ( matchingItem[0].chance);
    //resB = ( matchingItem[0].consumption);
    //console.log('chance', resA);
    //console.log('consumption', resB);


    


