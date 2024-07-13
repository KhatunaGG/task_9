#! /usr/bin/env node
const { Command } = require('commander')
const program = new Command()
const axios = require('axios')


// Create a weather CLI tool that: Takes a city name as input Fetches and displays the exact 
// temperature in Celsius using this API endpoint: 
// https://api.openweathermap.org/data/2.5/weather?q={cityName}&units=metric&appid=895284fb2d2c50a520ea537456963d9c


program
.command('getWeather')
.argument('<city>')
.action(async (city) => {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`)
        const weatherData = res.data
        // console.log(weatherData)
        console.log(weatherData.main.temp)
    } catch(er) {
        throw new Error({massage: 'City not found!'})
    }

})

program.parse()


