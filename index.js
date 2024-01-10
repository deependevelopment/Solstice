const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const pvp = require('mineflayer-pvp').plugin
const autoeat = require('mineflayer-auto-eat').plugin
const settings = require('./config.json')
const fs = require('fs')

if (!settings.ip) {
  console.error('settings.ip is required. Please fill out the IP field in the config.json file. Error 100');
}

if (!settings.name) {
  console.error('settings.name is required. Please fill out the name field in the config.json file. Error 101');
}

if (!settings.version) {
  console.log('Warning: If version is not specified, bot will use default version.');
}

if (!settings.auth) {
  console.error('settings.auth is required. Please fill out the auth field in the config.json file. Error 101');
}
// const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
// const GoalFollow = goals.GoalFollow

function getRandomItem(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
}

function version() {
  if (settings.version === undefined) {
    return "1.20.1";
  } else {
    return settings.version;
  }
}
const bot = mineflayer.createBot({
  host: settings.ip,
  username: settings.name,
  version: version(),
  // port: settings.port
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
bot.loadPlugin(autoeat)
bot.loadPlugin(require('mineflayer-collectblock').plugin)
// bot.loadPlugin(pathfinder)

// function followPlayer() {
//   const player = p => p.type === "player";
//   const mcData = require('minecraft-data')(bot.version);
//   const movements = new Movements(mcData);
  
//   bot.pathfinder.setMovements(movements);
//   const goal = new GoalFollow(player.entity, 3)
//   bot.pathfinder.setGoal(goal, true);

// }
const prefix = ",do "
const password = settings.password
const login = `/login ${password}`

const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const { setIntqerval } = require('timers/promises');

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
  inventoryViewer(bot);
  if (settings.auth === "registered") {
    bot.chat(login)
  } else {
    bot.chat(`/register ${settings.password}`)
    bot.chat(`/register ${settings.password} ${settings.password}`)
  }
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.setPrompt('> ');
  rl.prompt();

  bot.on('message', (message) => {
    if (settings.ip === "Minezilla.info.gf") return;
    console.log(`${message.toAnsi()}`);
    rl.prompt();
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}/${month}/${year}`;
    // const fileExists = fs.existsSync(`./chatlogs/${currentDate}`);
    // fs.existsSync(`./chatlogs/${currentDate}`) ? fs.appendFileSync(`./chatlogs/${currentDate}, message.text`) : fs.writeFileSync(`./chatlogs/${currentDate}`, message.text);
  })
  rl.on('line', (line) => {
    if (line.toString() === 'playerlist') {
      const playerList = Object.keys(bot.players).join(", ")
      console.log(playerList)
    } else {
      readline.moveCursor(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      bot.chat(line.toString());
    }
  })
  bot.on('chat', (username, message) => {
    if (message === 'follow me') {
      const player = bot.players[username]
  
      if (!player) {
        bot.chat("I can't see you.");
        return;
      }
      bot.pvp.attack(player.entity);
    }
  })
  bot.on('whisper', (username, message) => {
    function smeltItems(smeltingItem) {
      // Replace 'your_item_to_smelt' with the item you want to smelt
      const itemToSmelt = bot.inventory.items().find(item => item.name === smeltingItem);
      const fuelItem = bot.inventory.items().find(item => item.name === 'coal');
      const furnaceID = bot.registry.blocksByName.furnace.id
    
      if (itemToSmelt && fuelItem) {
        const furnace = bot.findBlock({
          matching: furnaceID,
          customName: 'your_furnace'
        });
    
        if (furnace) {
          bot.lookAt(furnace.position.offset(0.5, 0.5, 0.5));
          bot.activateBlock(furnace);
    
          bot.on('windowOpen', () => {
            const furnaceWindow = bot.currentWindow;
    
            // Check if the fuel slot is available in the furnace window
            const fuelSlot = furnaceWindow.slots.find(slot => slot && slot.fuel);
            
            if (fuelSlot) {
              bot.clickWindow(fuelItem.slot, 0, 0); // Place fuel in the furnace
              bot.clickWindow(itemToSmelt.slot, 0, 0); // Place item to smelt in the furnace
            }
          });
        } else {
          console.log('Furnace not found.');
        }
      } else {
        console.log('Item to smelt or suitable fuel not found in inventory.');
      }
    }
    if (message.startsWith(',smeltitem')) {
      const args = message.split(' ');
      const itemToSmelt = args[1];
      smeltItems(itemToSmelt);
    }
    function randomTask() {
      const tasks = [
        'Find Diamond Ore [Medium]',
        'Find a Pillager Outpost [Hard]',
        'Make a Potion Of Turtle Master without looking at any online resources [Medium]',
        `Error - You are so fucking bad at Minecraft I couldn't find any tasks for you`,
        `Breed 2 Chickens`,
        `build to y lvl 200`,
        `Make gold helmet`,
        `Kill the other player`,
        `Build a "M" with soul sand`,
        `Reach y level 5`,
        `Eat 1 rotten flesh`,
        `Tame a horse`,
        `Die`,
        `Open a book in a lectern`,
        `Grow one wheat seed`,
        `Get an apple`,
        `Get a cooked salmon`,
        `Get any mob in a hole`,
        `Build a 4x4 concrete wall`,
        `Survive an apocalypse`,
        `survive a 30 block jump`,
        `Kill an iron golem`,
        `Find a Village`,
        `Death Run`,
        `Get a fish in a bucket`,
        `Hide or seek`,
        `Make a cake and eat it`,
        `Hit a target 50 blocks away`,
        `Take nausea effect`,
        `Make a full set of iron tools`,
        `Make a jukebox`,
        `Get a rabbit's foot`,
        `Die`,
        `Craft a piece of wool`,
        `Get an orange baby sheep`,
        `Craft a diamond hoe`,
        `Deflect a ghast's ball`,
        `Get a music disc`,
        `Craft a hay bale`,
        `Spin again`,
        `Craft a clock`,
        `Brew a fire res potion`,
        `Build a 4x4 mossy cobble wall`,
        `Cure a zombie villager`,
        `Craft one eye of ender `,
        `Kill the other player `,
        `Spin again`,
        `Ring a bell`,
        `Craft a redstone lamp`,
        `Obtain either a red or brown mushroom`,
        `Fill inventory`,
        `Craft a magma block`,
        `Craft black stained glass`,
        `50 block height 360 MLG`,
        `Obtain a honey bottle`,
        `Turn off fire with splash water`,
        `Spin again`,
        `Craft a fletching table `,
        `Craft a geography table`,
        `Make a purple bed`,
        `Eat a berry`,
        `Obtain pink glazed terracotta `,
        `Craft a firework`,
        `Kill the other player`,
        `Obtain a trident`,
        `Burp`,
        `Craft 8 nether bricks`,
        `Craft warped or crimson hyphae`,
        `Craft a nether wart block`,
        `Craft a full set of iron armour`
      ]
      const randomTask = getRandomItem(tasks);
      const time = Math.floor(Math.random() * 6);
      const msg = `Here's your task: ${randomTask}. You have ${time} minutes to do it.`;
      return msg;
      
    }
    if (message === 'task') {
      bot.chat(`/w ${username} ${randomTask()}`);
    }
    function cCmd(extraParams) {
      if (!extraParams) {
        if (message.startsWith(prefix)) {
          return true;
        } else {
          return false;
        }
      } else {
        if (message.startsWith(prefix + extraParams)) {
          return true;
        } else {
          return false;
        }
      }
    }
    if (message === 'come back') {
      bot.chat(`/tpa ${username}`)
    }
    if (message === 'lookatme') {
      function lookAtNearestPlayer() {
        const playerFilter = (entity) => entity.type === 'player'
        const playerEntity = bot.nearestEntity(playerFilter);
    
        if (!playerEntity) return;
        const pos= playerEntity.position;
        bot.lookAt(pos);
      }
      lookAtNearestPlayer()
    }
    if (message === 'sleep') {
      async function goToSleep () {
        const bed = bot.findBlock({
          matching: block => bot.isABed(block)
        })
        if (bed) {
          try {
            await bot.sleep(bed)
            bot.chat("I'm sleeping")
          } catch (err) {
            bot.chat(`I can't sleep: ${err.message}`)
          }
        } else {
          bot.chat('No nearby bed')
        }
      }
      goToSleep()
    }
    if (message === 'wake') {
      async function wakeUp () {
        try {
          await bot.wake()
        } catch (err) {
          bot.chat(`I can't wake up: ${err.message}`)
        }
      }
      wakeUp()
    }
    if (message.startsWith(',toss')) {
      const args = message.split(' ')
      const name = args[1];
      const amount = args[2];
      tossItem(name, amount);
      async function tossItem (name, amount) {
        amount = parseInt(amount, 10)
        const item = itemByName(name)
        if (!item) {
          bot.chat(`I have no ${name}`)
        } else {
          try {
            if (amount) {
              await bot.toss(item.type, null, amount)
              bot.chat(`Tossed ${amount} x ${name}`)
            } else {
              await bot.tossStack(item)
              bot.chat(`Tossed ${name}`)
            }
          } catch (err) {
            bot.chat(`Unable to toss: ${err.message}`)
          }
        }
      }
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
    }
    if (message === ',sayitems') {
      function sayItems (items = null) {
        if (!items) {
          items = bot.inventory.items()
          if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        }
        const output = items.map(itemToString).join(', ')
        if (output) {
          bot.chat(output)
        } else {
          bot.chat('empty')
        }
      }
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
      sayItems()
    }
    if (message.startsWith(',craftitems ')) {
      const args = message.split(' ');
      const name = args[1];
      const amount = args[2];
      craftItem(name, amount)
      async function craftItem (name, amount) {
        amount = parseInt(amount, 10)
        const item = bot.registry.itemsByName[name]
        const craftingTableID = bot.registry.blocksByName.crafting_table.id
      
        const craftingTable = bot.findBlock({
          matching: craftingTableID
        })
      
        if (item) {
          const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0]
          if (recipe) {
            bot.chat(`I can make ${name}`)
            try {
              await bot.craft(recipe, amount, craftingTable)
              bot.chat(`did the recipe for ${name} ${amount} times`)
            } catch (err) {
              bot.chat(`error making ${name}`)
            }
          } else {
            bot.chat(`I cannot make ${name}`)
          }
        } else {
          bot.chat(`unknown item: ${name}`)
        }
      }
      
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
    }
    if (message.startsWith(',collect ')) {
      const continueForever = message.split(' ')[3];
      async function execute() {
        const value = message.split(' ')[1];
        const count = message.split(' ')[2];
        const blockType = bot.registry.blocksByName[value];
        if (!blockType) {
          return;
        }
    
        const blocks = bot.findBlocks({
          matching: blockType.id,
          maxDistance: 256,
          count: count,
        });
    
        if (blocks.length === 0) {
          bot.chat(`/w ${username} Block not found. Quitting.`);
          return;
        }
    
        const targets = [];
        for (let i = 0; i < Math.min(blocks.length, count); i++) {
          targets.push(bot.blockAt(blocks[i]));
        }
        bot.chat(`/w ${username} Mining started.`)
    
        try {
          await bot.collectBlock.collect(targets);
          bot.chat(`/w ${username} Mining finished.`)
        } catch (err) {
          bot.chat(`/w ${username} ${err.message}`);
          if (continueForever === 'true') {
            execute()
          } else return;
        }
      }
      execute()
    }
    if (message.startsWith(',dropall')) {
      const itemToDrop = message.split(',dropall ')[1];
      function dropItem(itemName) {
        const inventory = bot.inventory.items();
        const itemsToDrop = inventory.filter(item => item.name === itemName);

        itemsToDrop.forEach(item => {
          bot.toss(item, () => {
            console.log(`Dropped ${item.count} ${itemName}`);
          });
        });
      }
      dropItem(itemToDrop);
    }
    if (cCmd() === true && username === 'Hitrocol') {
      bot.chat(`/msg ${username} done!`)
      bot.chat(message.split(',do ')[1]);
      console.log(`Hitrocol issued command: \`${message}\``);
    }
    if (message.startsWith('[Discord | Member] Hitrocol » ,do ')) {
      bot.chat(message.split(',do ')[1]);
      console.log(`Hitrocol issued command: \`${message}\``);
    }
    if (cCmd("_login")) {
      bot.chat(login)
    }
    if (cCmd("_logout")) {
      bot.chat('/logout')
    }
  })
  bot.on('chat', (username, message) => {
    bot.acceptResourcePack()
    function cCmd(extraParams) {
      if (!extraParams    ) {
        if (message.startsWith(prefix)) {
          return true;
        } else {
          return false;
        }
      } else {
        if (message.startsWith(prefix + extraParams)) {
          return true;
        } else {
          return false;
        }
      }
    }
    if (message === 'come back') {
      bot.chat(`/tpa ${username}`)
    }
    if (message === 'lookatme') {
      function lookAtNearestPlayer() {
        const playerFilter = (entity) => entity.type === 'player'
        const playerEntity = bot.nearestEntity(playerFilter);
    
        if (!playerEntity) return;
        const pos= playerEntity.position;
        bot.lookAt(pos);
      }
      lookAtNearestPlayer()
    }
    if (message === 'sleep') {
      async function goToSleep () {
        const bed = bot.findBlock({
          matching: block => bot.isABed(block)
        })
        if (bed) {
          try {
            await bot.sleep(bed)
            bot.chat("I'm sleeping")
          } catch (err) {
            bot.chat(`I can't sleep: ${err.message}`)
          }
        } else {
          bot.chat('No nearby bed')
        }
      }
      goToSleep()
    }
    if (message === 'wake') {
      async function wakeUp () {
        try {
          await bot.wake()
        } catch (err) {
          bot.chat(`I can't wake up: ${err.message}`)
        }
      }
      wakeUp()
    }
    if (message.startsWith(',toss')) {
      const args = message.split(' ')
      const name = args[1];
      const amount = args[2];
      tossItem(name, amount);
      async function tossItem (name, amount) {
        amount = parseInt(amount, 10)
        const item = itemByName(name)
        if (!item) {
          bot.chat(`I have no ${name}`)
        } else {
          try {
            if (amount) {
              await bot.toss(item.type, null, amount)
              bot.chat(`Tossed ${amount} x ${name}`)
            } else {
              await bot.tossStack(item)
              bot.chat(`Tossed ${name}`)
            }
          } catch (err) {
            bot.chat(`Unable to toss: ${err.message}`)
          }
        }
      }
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
    }
    if (message === ',sayitems') {
      function sayItems (items = null) {
        if (!items) {
          items = bot.inventory.items()
          if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        }
        const output = items.map(itemToString).join(', ')
        if (output) {
          bot.chat(output)
        } else {
          bot.chat('empty')
        }
      }
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
      sayItems()
    }
    if (message.startsWith(',craftitems ')) {
      const args = message.split(' ');
      const name = args[1];
      const amount = args[2];
      craftItem(name, amount)
      async function craftItem (name, amount) {
        amount = parseInt(amount, 10)
        const item = bot.registry.itemsByName[name]
        const craftingTableID = bot.registry.blocksByName.crafting_table.id
      
        const craftingTable = bot.findBlock({
          matching: craftingTableID
        })
      
        if (item) {
          const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0]
          if (recipe) {
            bot.chat(`I can make ${name}`)
            try {
              await bot.craft(recipe, amount, craftingTable)
              bot.chat(`did the recipe for ${name} ${amount} times`)
            } catch (err) {
              bot.chat(`error making ${name}`)
            }
          } else {
            bot.chat(`I cannot make ${name}`)
          }
        } else {
          bot.chat(`unknown item: ${name}`)
        }
      }
      
      function itemToString (item) {
        if (item) {
          return `${item.name} x ${item.count}`
        } else {
          return '(nothing)'
        }
      }
      
      function itemByName (name) {
        const items = bot.inventory.items()
        if (bot.registry.isNewerOrEqualTo('1.9') && bot.inventory.slots[45]) items.push(bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
      }
    }
    if (message.startsWith(',collect ')) {
      const continueForever = message.split(' ')[3];
      async function execute() {
        const value = message.split(' ')[1];
        const count = message.split(' ')[2];
        const blockType = bot.registry.blocksByName[value];
        if (!blockType) {
          return;
        }
    
        const blocks = bot.findBlocks({
          matching: blockType.id,
          maxDistance: 256,
          count: count,
        });
    
        if (blocks.length === 0) {
          bot.chat(`/w ${username} Block not found. Quitting.`);
          return;
        }
    
        const targets = [];
        for (let i = 0; i < Math.min(blocks.length, count); i++) {
          targets.push(bot.blockAt(blocks[i]));
        }
        bot.chat(`/w ${username} Mining started.`)
    
        try {
          await bot.collectBlock.collect(targets);
          bot.chat(`/w ${username} Mining finished.`)
        } catch (err) {
          bot.chat(`/w ${username} ${err.message}`);
          if (continueForever === 'true') {
            execute()
          } else return;
        }
      }
      execute()
    }
    if (cCmd() === true && username === 'Hitrocol') {
      bot.chat(`/msg ${username} done!`)
      bot.chat(message.split(',do ')[1]);
      console.log(`Hitrocol issued command: \`${message}\``);
    }
    if (message.startsWith('[Discord | Member] Hitrocol » ,do ')) {
      bot.chat(message.split(',do ')[1]);
      console.log(`Hitrocol issued command: \`${message}\``);
    }
    if (cCmd("_login")) {
      bot.chat(login)
    }
    if (cCmd("_logout")) {
      bot.chat('/logout')
    }
  })
})

// bot.on('physicsTick', followPlayer);