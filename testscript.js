let testData = {group1:[
    {   name : 'Level 1',
        rating : 10},
    {   name : 'Level 2',
        rating : 20}
]};




let item = {name : 'Level 1'};
let pos = testData['group1'].indexOf(item);

let res = 0;

let matchingItem = testData['group1'].filter( (obj) => {

    if(obj.name === item.name){
        return true;
    }
    return false;
})

res = ( matchingItem[0].rating);
console.log( res);







let movies = {group1:[
    {id:1, title:'Shaun of the Dead'},
    {id:2, title:'Man Up'},
    {id:3, title:'Terminal'},
    {id:4, title:'The End of the World'},
    {id:5, title:'Hot Fuzz'},
    {id:6, title:'Mission Impossible: Fallout'}
]};




//let test = 'Level 1';
let pos = testData.indexOf('Level 1');
console.log(pos); 




let entries = Object.entries(testData['group1']);
    console.log(entries);
let names = testData['group1'];                        
    for (let i=0, len=names.length; i<len; i++){
        console.log(names[i].name);
    };
let ratings = testData['group1'];                        
    for (let i=0, len=ratings.length; i<len; i++){
    console.log(ratings[i].rating);
    };

    

// Array.prototype.indexOf()   //returns index number
// Array.prototype.contains()  //returns boolean
// Array.prototype.filter()    //returns array
// Array.prototype.some()      //returns boolean
// Finding matches in Arrays

const log = console.log;

let movies = {group1:[
    {id:1, title:'Shaun of the Dead'},
    {id:2, title:'Man Up'},
    {id:3, title:'Terminal'},
    {id:4, title:'The End of the World'},
    {id:5, title:'Hot Fuzz'},
    {id:6, title:'Mission Impossible: Fallout'}
]};

let item = {id:2};
let pos = movies['group1'].indexOf(item);

let res = 0;

let matchingMovie = movies['group1'].filter( (obj) => {

    if(obj.id === item.id){
        return true;
    }
    return false;
})

res = ( matchingMovie[0].title);
log( res);


