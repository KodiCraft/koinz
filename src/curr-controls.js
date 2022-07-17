// This file contains and describes all of the controls that we have. This script should handle and implement console commands.
const consoleInput = document.getElementById('console-input-text');
const consoleOutput = document.getElementById('console-output-text');
const consoleToolTip = document.getElementById('console-help-text');

var CONSOLE_HISTORY = [];
var CONSOLE_HISTORY_INDEX = 0;

let Koinz = {
    total_koinz: 0,
    total_maroul: 0,

    koinz_per_maroul: 0,
    kpm_hist: [],

    profit_margin: 0,
}

function init(koinz, maroul) {

    // Check if the arguments can be parsed as numbers
    if (isNaN(koinz) || isNaN(maroul)) {         
        return 'Invalid arguments';
    }
    // Parse the arguments
    koinz = parseInt(koinz);
    maroul = parseInt(maroul);
    // Check if the arguments are valid
    if (koinz < 0 || maroul < 0) {
        return 'Invalid arguments';
    }
    // Set the values
    Koinz.total_koinz = parseInt(koinz);
    Koinz.total_maroul = parseInt(maroul);

    // Set a default kpm value
    Koinz.koinz_per_maroul = Koinz.total_koinz / Koinz.total_maroul;

    // Start the loop
    update_koinz_per_maroul_loop();

    
    return `Koinz in the economy: ${Koinz.total_koinz} | Maroul available: ${Koinz.total_maroul}`;
}
init.syntax = 'init <koinz> <maroul> | Initializes the economy';

function buy(maroul) {
    if(isNaN(maroul)) {
        return 'Invalid arguments';
    }

    Koinz.total_koinz += maroul * Koinz.koinz_per_maroul;
    Koinz.total_maroul += maroul;
    return `Bought ${maroul * Koinz.koinz_per_maroul} koinz for ${maroul} maroul. Koinz in the economy: ${Koinz.total_koinz} | Owned maroul: ${Koinz.total_maroul}`;
}
buy.syntax = 'buy <maroul> | Buys koinz for a certain amount of maroul';

function sell(koinz) {
    if(isNaN(koinz)) {
        return 'Invalid arguments';
    }

    // We can only sell koinz if we get an integer amount of maroul
    if (koinz / Koinz.koinz_per_maroul != Math.floor(koinz / Koinz.koinz_per_maroul)) {
        return `Invalid amount of koinz: ${koinz}, need at least ${Math.floor(koinz / Koinz.koinz_per_maroul)} maroul`;
    }

    Koinz.total_koinz -= koinz;
    Koinz.total_maroul += koinz / Koinz.koinz_per_maroul;
    return `Sold ${koinz} koinz for ${koinz / Koinz.koinz_per_maroul} maroul. Koinz in the economy: ${Koinz.total_koinz} | Owned maroul: ${Koinz.total_maroul}`;
}
sell.syntax = 'sell <koinz> | Sells koinz for a certain amount of maroul';

function add(currency, amount) {
    if(isNaN(amount)) {
        return 'Invalid arguments';
    }

    // Check if the entered currency is "maroul" or "koinz"
    if (currency == 'maroul') {
        Koinz.total_maroul += amount;
    }
    if (currency == 'koinz') {
        Koinz.total_koinz += amount;
    }
    return `Added ${amount} ${currency} to the economy. Koinz in the economy: ${Koinz.total_koinz} | Owned maroul: ${Koinz.total_maroul}`;
}
add.syntax = 'add <currency> <amount> | Adds a certain amount of currency to the economy';

function sub(currency, amount) {
    if(isNaN(amount)) {
        return 'Invalid arguments';
    }

    // Check if the entered currency is "maroul" or "koinz"
    if (currency == 'maroul') {
        Koinz.total_maroul -= amount;
    }
    if (currency == 'koinz') {
        Koinz.total_koinz -= amount;
    }
    return `Subtracted ${amount} ${currency} from the economy. Koinz in the economy: ${Koinz.total_koinz} | Owned maroul: ${Koinz.total_maroul}`;
}
sub.syntax = 'sub <currency> <amount> | Subtracts a certain amount of currency from the economy';

function dislpay_profits() {
    return `Target profit margin: ${Koinz.profit_margin} | Profits: ${profits()}`;
}
dislpay_profits.syntax = 'profits | Displays the current profits';

function set_profits(newAmount) {
    if(isNaN(newAmount)) {
        return 'Invalid arguments';
    }
    Koinz.profit_margin = newAmount;
    return `Set target profits to ${newAmount}`;
}
set_profits.syntax = 'set_profits <newAmount> | Sets the target profits';

function evaluate(expression) {
    return eval(expression);
}
evaluate.syntax = 'eval <expression> | Evaluates javascript';


function show() {
    return `Koinz in the economy: ${Koinz.total_koinz} | Owned maroul: ${Koinz.total_maroul}`;
}
show.syntax = 'show | Displays the current amount of koinz and maroul';

function help()
{
    // Since our output is one line, we print the help in an alert
    var out = 'All commands:\n\n';
    for (const command of Object.values(commands)) {
        out += command.syntax + '\n';
    }

    alert(out);
}
help.syntax = 'help | Displays the help';

function bill(koinz) {
    // Converts the amount of coinz passed into a list of bank notes
    if(isNaN(koinz)) {
        return 'Invalid arguments';
    }

    var banknotes = {
        20: 0,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
    }

    if(!Object.keys(banknotes).includes("1")) {
        throw new Error('The banknote array is not properly set up!!');
    }

    var remaining = koinz;

    while(remaining > 0) {
        for (const note of Object.keys(banknotes).sort((a, b) => b - a)) {
                if (remaining >= note) {
                    banknotes[note]++;
                    remaining -= note;
                    break;
                }
            }
        
    }

    // Format the output
    var output = '';
    for (const note of Object.keys(banknotes)) {
        output += `${banknotes[note]} x ${note}$ `;
    }
    return output;
}
bill.syntax = 'bill <koinz> | Converts koinz into banknotes';

const commands = {
    'init': init,
    'buy': buy,
    'sell': sell,
    'add': add,
    'sub': sub,
    'profits': dislpay_profits,
    'set_profits': set_profits,
    'eval': evaluate,
    'bill': bill,
    'show': show,
    'help': help,
}

function onSubmit() {
    const input = consoleInput.value;
    // Parse the input
    const command = input.split(' ')[0];
    const args = input.split(' ').slice(1);

    // Check if any of the args can be parsed as numbers, if so, parse them
    for (let i = 0; i < args.length; i++) {
        if (isNaN(args[i])) {
            continue;
        }
        args[i] = parseInt(args[i]);
    }

    // Check if the command exists
    if (commands[command]) {
        CONSOLE_HISTORY.push(input);
        // Execute the command
        const result = () => {
            try {
                return commands[command](...args);
            } catch (e) {
                return e.toString().replace(/\n/g, ' ');
            }
        }
        // Show the result
        consoleOutput.innerText = result();
    } else {
        consoleOutput.innerText = `Command ${command} not found`;
    }

    consoleInput.value = '';
}

function onType(extraChar) {
    // Parse the command
    const input = consoleInput.value + extraChar;
    const command = input.split(' ')[0];
    // Fuzzy search for the command
    const commands_list = Object.keys(commands);
    const command_match = commands_list.filter(_command => _command.includes(command));
    // If any command exists, show its syntax in the tooltip
    if (command_match.length > 0) {
        consoleToolTip.innerText = commands[command_match[0]].syntax;
    } else {
        consoleToolTip.innerText = 'Command not found';
    }

}

consoleInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        CONSOLE_HISTORY_INDEX = CONSOLE_HISTORY.length - 1;
        onSubmit();
    }
    
    // Arrow up and down to navigate through the history
    if (e.keyCode === 38) {
        if (CONSOLE_HISTORY_INDEX < CONSOLE_HISTORY.length - 1) {
            if(CONSOLE_HISTORY_INDEX < CONSOLE_HISTORY.length - 1) {
            CONSOLE_HISTORY_INDEX++;
            consoleInput.value = CONSOLE_HISTORY[CONSOLE_HISTORY_INDEX];
            }
        }
    }
    if (e.keyCode === 40) {
        if (CONSOLE_HISTORY_INDEX > 0) {
            CONSOLE_HISTORY_INDEX--;
            consoleInput.value = CONSOLE_HISTORY[CONSOLE_HISTORY_INDEX];
        }
    }

    onType(e.key.length == 1 ? e.key : '');
})