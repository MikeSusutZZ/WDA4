require("dotenv").config();
const express = require('express');
const fetch = require('node-fetch').default;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
const port = 3000;
let size = 12;
let pokemonList;
let numbers;
let pick1;
let pick2;
let clicks;
let theme = "grey";
let pairs;
let pairsLeft;

app.get('/', async (req, res) => {
  clicks = 0;
  pairs = size / 2;
  pairsLeft = pairs;
  pick1 = null;
  pick2 = null;
  pokemonList = [];
  numbers = genList(size);
  for (let i = 0; i < size; i++) {
    const apiRet = await fetch(`https://pokeapi.co/api/v2/pokemon/${numbers[i]}`);
    const data = await apiRet.json();

    pokemonList.push({
      number: numbers[i],
      image: data.sprites.front_default,
      view: false
    });
  }


  const startTime = new Date().getTime();
  const endTime = startTime + 60000; // Redirect after 1 minute (60000 milliseconds)
  res.redirect("/play");
});

app.get('/play', async (req, res) => {
  
  res.render("main", { pokemon: pokemonList, clicks: clicks, theme: theme, pairs: pairs, left: pairsLeft });
})

app.get("/update", (req, res) => {

  var pick = req.query.pick;

  if (pick1 == null) {
    clicks++;
    pick1 = pick;
    pokemonList[pick].view = true;
    res.redirect("/play");
    console.log(pokemonList[pick1].number);
    return;
  }

  if (pick2 == null) {
    clicks++;
    pick2 = pick;
    pokemonList[pick].view = true;
    res.redirect("/play");
    console.log(pokemonList[pick2].number);
    return;
  }

  else {
    if (pokemonList[pick1].number === pokemonList[pick2].number && pick1 != pick2) {
      var offset = 0;
      pokemonList.splice(pick1, 1);
      if (pick1 < pick2) {
        offset = 1;
        
      }
      console.log(pick2 - offset);
      pokemonList.splice(pick2 - offset, 1);
      pairsLeft--;
    }
    for (i = 0; i < pokemonList.length; i++) {
      pokemonList[i].view = false;
    }
    pick1 = null;
    pick2 = null;
    if (pokemonList.length == 0) {
      res.render("win", { clicks: clicks });
      return;
    }
    
    
    var randomNumber = Math.floor(Math.random() * 2);
    // Check if the random number is 0 (1% chance)
    if (randomNumber === 0) {
      for (i = 0; i < pokemonList.length; i++) {
        pokemonList[i].view = true;
        
      }
      console.log("powerup");
      
    }
    res.redirect("/play");

  }
})

app.get("/themeChange", (req, res) => {
  if (theme == "white") {
    theme = "grey";
  }
  else { theme = "white"; }
  res.redirect("/");
})

app.get("/dif", (req, res) => {
  size = req.query.size;
  res.redirect("/");
})

function genList(size) {
  if (size % 2 !== 0) {
    console.error("Size must be an even number.");
    return [];
  }

  const list = [];
  const availableNumbers = Array.from({ length: 810 }, (_, i) => i + 1);

  for (let i = 0; i < size / 2; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomNum = availableNumbers[randomIndex];

    list.push(randomNum, randomNum);
    availableNumbers.splice(randomIndex, 1);
  }

  shuffleArray(list);
  console.log(list);
  return list;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
