// The basic schema of our currency algorithms is as follows:
// We track how much koinz is currently in the economy
// We track how much maroul is currently available
// We control the value of koinz per maroul
// We can estimate our "debt" based on how much koinz is out in the economy and how much koinz are worth
// Users are happy if they get profits in koinz which is why we want to keep the value as high as possible
// However we must keep our debt low enough so that we can still make a little bit of profit
// Sometimes, koinz leave the economy for free, this allows us to catch up and make loads of profit

// We also want overloads to calculate the debt or profits for a given value of koinz
function debt(price) {
    price = price || Koinz.koinz_per_maroul;
    return Math.floor(Koinz.total_koinz / price);
}

function profits(price) {
    price = price || Koinz.koinz_per_maroul;
    return Koinz.total_maroul - debt(price);
}

// Now we want to create our function to calculate the optimal value of koinz per maroul
// We want to keep the value as high as possible while still keeping our profit positive
function target_value() {
    // We first calculate our current profits
    const initial_profits = profits();
    
    // If profits are above our profit margin, we want to increase the value until we reach our profit margin
    if (initial_profits > Koinz.profit_margin) {
        // We want to increase the value until we reach our profit margin
        let value = Koinz.koinz_per_maroul;
        while (profits(value) > Koinz.profit_margin) {
            value -= 1;
        }

        // We cannot allow the value to be less than 1
        if (value < 1) {
            value = 1;
        }

        return value;
    }

    // If profits are below our profit margin, we want to decrease the value until we reach our profit margin
    if (initial_profits < Koinz.profit_margin) {
        // We want to decrease the value until we reach our profit margin
        let value = Koinz.koinz_per_maroul;
        while (profits(value) < Koinz.profit_margin) {
            value += 1;
        }

        // We cannot allow the value to be less than 1
        if (value < 1) {
            return 1;
        }

        return value;
    }

    // If we are exactly ar our profit margin, we can simply keep the current price
    return Koinz.koinz_per_maroul;
}

// In order to properly trick the user, we want to add some amount of random variation while still not getting bankrupt
function target_with_variation() {
    // First calculate our target value
    const target = target_value();

    // Then we add a random variation to it
    var variation = Math.floor((Math.random() - 0.5) * 2 * (0.5 * target));
    // Make sure that the target + variation doesnt make us bankrupt
    while (profits(target + variation) < -1) {
        variation = Math.floor((Math.random() - 0.5) * 2 * (0.5 * target));
    }
    // If target + variation is lesser than 1, we want to make sure that we dont go below 1
    if (target + variation < 1) {
        return 1;
    }

    console.log(`Target kpm: ${target}, variation: ${variation} | Total kpm: ${target + variation}`);

    return target + variation;
}

// This function will be called every 30 seconds to update the value of koinz per maroul
function update_koinz_per_maroul() {
    // We first calculate our target value
    const target = target_with_variation();
    // Then we set the new value
    Koinz.koinz_per_maroul = target;
    // And we add it to our history
    Koinz.kpm_hist.push(target);
}

function update_info() {
    document.getElementById("current-price").innerHTML = Koinz.koinz_per_maroul;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// This is an async function that repeatedly calls update_koinz_per_maroul() every 30 seconds
async function update_koinz_per_maroul_loop() {
    while (true) {
        update_koinz_per_maroul();
        update_chart();
        update_info();
        await sleep(30000);
        //await sleep(5000);
    }
}