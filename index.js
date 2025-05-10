/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i += 1){
        // create a new div element, which will become the game card
        const game = games[i];

        let newDiv = document.createElement('div');

        let gameImg = game.img;
        let gameName = game.name;
        let gameDesc = game.description;
        let gamePledged = game.pledged;
        let gameGoal = game.goal;
        let gameBackers = game.backers;


        // add the class game-card to the list
        newDiv.classList.add('game-card');


        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        newDiv.innerHTML = `<img src="${gameImg}" alt="${gameName}" class="game-img" /> <h2>${gameName}</h2> <p>${gameDesc}
        <h3>Goal: ${gamePledged} / ${gameGoal} ${gamePledged > gameGoal ? "  🎉" : ""}</h3> <br> Backers: ${gameBackers}
        `;


        // append the game to the games-container
        document.getElementById("games-container").appendChild(newDiv);
    }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
}, 0)


// set the inner HTML using a template literal and toLocaleString to get a number with commas   
contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalPledged = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged;
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalPledged.toLocaleString('en-US')}`;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const totalGames = GAMES_JSON.reduce( (acc, game) => {
    return acc + 1;
}, 0)

gamesCard.innerHTML =  `${totalGames}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let gamesNotMetGoal = GAMES_JSON.filter ( (game) => {
        return game.goal > game.pledged;
    });

    // use the function we previously created to add the unfunded games to the DOM
    errorParagraph.style.display = "none";
    addGamesToPage(gamesNotMetGoal);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let gamesMetGoal = GAMES_JSON.filter ( (game) =>{
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    errorParagraph.style.display = "none";
    addGamesToPage(gamesMetGoal);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    errorParagraph.style.display = "none";
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.reduce( (acc, game) => {
    if (game.pledged < game.goal){
        return acc + 1;
    }
    return acc;
}, 0)


// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalPledged.toLocaleString('en-US')} has been raised for ${totalGames} games. 
    Currently, ${unfundedGames} ${unfundedGames > 1 ? "games remain unfunded." : "game remains unfunded."} We need your help to fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
let newParagraph = document.createElement('p')
newParagraph.style = "text-align: center";
newParagraph.innerHTML = displayStr;
document.getElementById('description-container').appendChild(newParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames;
const{name: name1} = firstGame;
const{name: name2} = secondGame;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameParagraph = document.createElement('p');
topGameParagraph.innerHTML = name1;
topGameParagraph.style = "color: black";
firstGameContainer.appendChild(topGameParagraph);



// do the same for the runner up item
const secondGameParagraph = document.createElement('p');
secondGameParagraph.innerHTML = name2;
secondGameParagraph.style = "color: black";
secondGameContainer.appendChild(secondGameParagraph);

// search function

const errorParagraph = document.getElementById('errorP');

function search(input){
    let searchedGame = GAMES_JSON.filter ( (game) => {
        return game.name == input;
    });
    if (searchedGame.length > 0){
        deleteChildElements(gamesContainer);
        addGamesToPage(searchedGame);
        errorParagraph.style.display = "none";
    }
    else{
        errorParagraph.innerHTML = "Game does not exist";
        errorParagraph.style = "text-align: center";
        errorParagraph.style = "color: red";
    }
}

const searchBox = document.getElementById("search");
searchBox.addEventListener("keydown", function(event){
    if (event.key === 'Enter'){
        search(searchBox.value);
    }
})