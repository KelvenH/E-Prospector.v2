
// Wait until DOM loaded before running the game
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (this.getAttribute("data-type") === "submit") {
                rungame();
            } 
            else if (this.getAttribute("data-type") === "upgrade") {
                runupgrade();

                
// Event listener for upgrade button

// Device upgrades A - User Selection

// Device upgrades B - Update Gameplay Stats

// Device upgrades C - Update Balance (post transaction)

// Event listener for run game button (initiate game cycle stages)

// Game stage A - generate coin ID

// Game stage B - check if coin ID matches miner ID

// Game Stage C - Calculate costs

// Game Stage D - Calculate Outcome 

// Update Balance (post game-cycle)

// Reset screen for new game?