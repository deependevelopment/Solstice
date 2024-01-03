const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin

// const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
// const GoalFollow = goals.GoalFollow

const bot = mineflayer.createBot({
  host: 'skaia.us',
  username: 'TRASHCAN',
  version: '1.20',
})

bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
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
const password = 'ilovemakingbotssomuchbro'
const login = `/login ${password}`

const { mineflayer: mineflayerViewer } = require('prismarine-viewer');
const { setInterval } = require('timers/promises');

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
  bot.chat(login)
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function getUserInput() {
    rl.question(``, (userInput) => {
      if (userInput.toLowerCase() === 'playerlist') {
        const playerList = Object.keys(bot.players).join(", ")
        console.log(playerList)
        getUserInput();
      } else {
        bot.chat(userInput);
        getUserInput();
      }
    });
  } 
  getUserInput();
  bot.on('message', (username) => {
    console.log(`${username}`);
  })
  bot.on('chat', (username, message) => {
    if (message === 'fight me') {
      const player = bot.players[username]
  
      if (!player) {
        bot.chat("I can't see you.")
        return
      }
      bot.pvp.attack(player.entity);
    }
    if (message === 'stop') {
      bot.pvp.stop()
    }
  })
  bot.on('whisper', (username, message) => {
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
    if (message.startsWith(',collect ')) {
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
          target = bot.collectBlock.findFromVein(targets);
          await bot.collectBlock.collect(target);
          bot.chat(`/w ${username} Mining finished.`)
        } catch (err) {
          bot.chat(`/w ${username} ${err.message}`);
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