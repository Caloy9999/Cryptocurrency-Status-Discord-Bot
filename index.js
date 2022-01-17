require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()

const coinId = "vigorus";
//const clientId = "932579782628106281";
const guildId = "932575805316427786";
const botSecret = "OTMyNTc5NzgyNjI4MTA2Mjgx.YeVCmg.ep6p5KNwGSa6PK6L049F_KFEhGk";

function getPrices() {


	// API for price data.
	axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${coinId}`).then(res => {
		// If we got a valid response
		if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
			let currentPrice = res.data[0].current_price || 0 // Default to zero
			let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero
			let symbol = res.data[0].symbol || '?' 
			
			client.user.setPresence({
				game: {
					// Example: "Watching -5,52% | BTC"
					name: `${priceChange.toFixed(2)}% | ${symbol.toUpperCase()}`,
					type: 3 // Use activity type 3 which is "Watching"
				}
			})
			
			
			console.log('Updated price to', currentPrice)
			client.guilds.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`${(currentPrice).toLocaleString().replace(/,/g,process.env.THOUSAND_SEPARATOR)}${process.env.CURRENCY_SYMBOL}`)

		
		}
		else
			console.log('Could not load player count data for', process.env.COIN_ID)

	}).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
	console.log('Logged in as', client.user.tag)

	getPrices() // Ping server once on startup
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
	setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

//https://discord.com/oauth2/authorize?client_id=932579782628106281&permissions=0&scope=bot%20applications.commands
client.login(process.env.DISCORD_TOKEN)
