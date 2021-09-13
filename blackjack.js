let game = {"You" : {"ScoreSpan":"#your-result",
              "Div":"#your-box",
               "Score" : 0},
            "Dealer":{"ScoreSpan":"#dealer-result",
                       "Div":"#dealer-box",
                         "Score" : 0},
            "Cards" : ["2","3","4","5","6","7","8","9","10","K","J","Q","A"],
            "cardMap" : {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"K":10,"J":10,"Q":10,"A":[1,11]},
            "Wins" : 0,
            "Losses" : 0,
            "Draws" : 0,
            "Stand" : false,
            "turnsOver" : false
             };
 
const YOU = game["You"];
const DEALER = game["Dealer"];
const CARDS = game["Cards"];
const HITSOUND = new Audio("swish.mp3");
const CMAP = game["cardMap"];
const WINSOUND = new Audio("cash.mp3");
const LOSSSOUND = new Audio("aww.mp3");



document.querySelector("#bj-hit").addEventListener("click",bjHit);
document.querySelector("#bj-deal").addEventListener("click",bjDeal);
document.querySelector("#bj-stand").addEventListener("click",dealerLogic);

function bjHit(){
    if(game["Stand"] === false){
        let card = randomCard();

        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
};

function showCard(card, activePlayer){
    if(activePlayer["Score"] <= 21){
        let cardImage = document.createElement("img");       //new img element created here 
        cardImage.src = `${card}.png`;                      //according to card img added to img element
        document.querySelector(activePlayer["Div"]).appendChild(cardImage); //new img element add to div box 
        HITSOUND.play();                                 //hit sound play called here to play sound
    };
};


function bjDeal(){
    if(game["turnsOver"] === true){              
        game["Stand"] = false;

        let yourImages = document.querySelector("#your-box").querySelectorAll("img");     //Select all img element of Player 
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img"); //Select all img element of Dealer 

        for(var i=0; i<yourImages.length;i++){              //Remove all img element
            yourImages[i].remove();                                  
        };

        for(var i=0;i<dealerImages.length;i++){            //Remove all img element 
            dealerImages[i].remove();
        };

        YOU["Score"] = 0;                        //Update Player score to 0;
        DEALER["Score"] = 0;                     //Update Dealer score to 0;

        document.querySelector("#your-result").textContent = 0;                     //update result of Player to 0 in page;
        document.querySelector("#dealer-result").textContent = 0;                   //update result of Dealer to 0 in page;    
        document.querySelector("#your-result").style.color = "springgreen";         
        document.querySelector("#dealer-result").style.color = "springgreen";
        document.querySelector("#result").textContent = "Let's Play"; 
        document.querySelector("#result").style.color = "black";

        game["turnsOver"] = true;   

    };
};

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return CARDS[randomIndex];
};

function updateScore(card, activePlayer){
    if(card === "A"){
        if(activePlayer["Score"] + CMAP[card][1] <= 21){      // get score for card A according to cardmap object
            activePlayer["Score"] += CMAP[card][1];          //A === 11 
        }else{
            activePlayer["Score"] += CMAP[card][0];          //A === 1
        }
    } else{
        activePlayer["Score"] += CMAP[card];                 //gat score for all other cards according to cardmap object
    };
};

function showScore(activePlayer){
    if(activePlayer["Score"] > 21){
        document.querySelector(activePlayer["ScoreSpan"]).textContent = "BUST!";           //Use to chech if score > 21 then bust and lost 
        document.querySelector(activePlayer["ScoreSpan"]).style.color = "red";
    }else{
        document.querySelector(activePlayer["ScoreSpan"]).textContent = activePlayer["Score"]; //Use to showing score if score < 21 
    };
};

function dealerLogic(){
    game["Stand"] = true;
    let card = randomCard();
    showCard(card,DEALER);
    updateScore(card,DEALER);
    showScore(DEALER);

    if(DEALER["Score"] > 15){
        game["turnsOver"] = true;
        let winner = computeWinner();
        showResult(winner);
    };
};


function computeWinner(){
    let winner;
    if(YOU["Score"] <= 21){
    if(YOU["Score"] > DEALER["Score"] || (DEALER["Score"] > 21)){       //Comparing player score and dealer score
        game["Wins"]++;
        winner = YOU;
    } else if(YOU["Score"] < DEALER["Score"]){                        
        game["Losses"]++;
        winner = DEALER;
    } else if(YOU["Score"] === DEALER["Score"]){          
        game["Draws"]++;
    }
    } else if (YOU["Score"] > 21 && DEALER["Score"] <= 21){
        game["Losses"]++;
        winner = DEALER;
    }else if(YOU["Score"] > 21 && DEALER["Score"] > 21){
        game["Draws"]++;
    };

    return winner;
};

function showResult(winner){
    let message,messagec;

    if(game["turnsOver"] === true){
        if(winner === YOU){                        //If player is winner 
            document.querySelector("#wins").textContent = game["Wins"];
            message = "You won";
            messagec = "springgreen";
            WINSOUND.play();                      //winsound play

        }else if(winner === DEALER){              //If dealer is winner
            document.querySelector("#losses").textContent = game["Losses"];
            message = "You lost";
            messagec = "red";
            LOSSSOUND.play();                     //losssound play
        } else{
            document.querySelector("#draws").textContent = game["Draws"]; 
            message = "You draw";
            messagec = "yellow";
        };

        document.querySelector("#result").textContent = message;   //assing winner aur loser aur draw 
        document.querySelector("#result").style.color = messagec;  
    };
};