    // Geschreven door Timur
    // Hulpmidddelen gebruikt : Klasgenoten hun javascript, google, AI, 

    // Luisteraar toevoegen aan de Dobbelknop
    document.getElementById('rollknop').addEventListener('click', dobbelstenenGooien);

    // Variabelen 
    var worpenOver = 3; 
    var vergrendeldeDobbelstenen = [false, false, false, false, false]; 
    var isScoreVastgezet = false

    var scores = {
        ones: 0,
        twos: 0,
        threes: 0,
        fours: 0,
        fives: 0,
        sixes: 0,
        ThreeOfAKind: 0,
        FourOfAKind: 0,
        FullHouse: 0,
        SmallStraight: 0,
        LargeStraight: 0,
        Chance: 0,
        Yahtzee: 0
    };

    
    // Functie om te dobbelen
    function dobbelstenenGooien() { 
        if (worpenOver > 0) {  // Als er nog worpen zijn 
            worpenOver--;  // Dan worpenover - 1

            document.getElementById('aantalWorpen').textContent = worpenOver + "/3 Rollen Over"; // Op het beeld gaat rollen 3/3 naar 2/3

            // Lege Array met dubbelwaardens die we zo gaan vullen
            var dobbelWaarden = [];
            for (var i = 0; i < 5; i++) { // For loop voor elke steen
                if (!vergrendeldeDobbelstenen[i]) { // Als niet vergrendeld is dan 
                    dobbelWaarden.push(Math.floor(Math.random() * 6) + 1); // Generen Random Getal tussen 1 en 6
                } else { // Als het vergrendeld is Dan 
                    dobbelWaarden.push(parseInt(document.getElementById('dobbel' + (i + 1)).textContent)); // De waarde van de dobbelsteen die vergreneld is een geen nieuw
                }
            }

            for (var i = 0; i < dobbelWaarden.length; i++) { // For loop voor het laten zien
                document.getElementById('dobbel' + (i + 1)).textContent = dobbelWaarden[i]; // De waarde van de dobbelwaarde laten zien op hetscherm
                
            }

            // Score berekenen en zien
            berekenEnToonScores(dobbelWaarden); // Roepen van de functie
        }
    }

function berekenEnToonScores(dobbelWaarden) {
    for (var i = 1; i <= 6; i++) {  // Een loop voor alle stenen
        var count = dobbelWaarden.filter(function (waarde) { // Filteren vab de dobbelwaarden om te zien wat we hebben gegooit
            return waarde === i;
        }).length;
        // Controleer of de score al is gekozen en vastgezet
        if (scores[krijgScoreId(i)] === 0) {  // Checken als het nog niet gekozen of gelocked
            document.getElementById(krijgScoreId(i)).textContent = count * i; // Dan kijken we bijvoorbeeld hoevaak het is gegooit en dan laten zien
        }
    }

    // Scores voor deel 2 ( Gelijk aan 0 betekent dat het nog niet is gekozen en een waarde terugbrengen)
    if (scores["ThreeOfAKind"] === 0) {
        document.getElementById("ThreeOfAKind").textContent = berekenTotaalVanGelijkeWaarden(dobbelWaarden, 3);
    }
    if (scores["Yahtzee"] === 0) {
        var yahtzeeScore = berekenYahtzeeScore(dobbelWaarden);
        document.getElementById("Yahtzee").textContent = yahtzeeScore;
    }
    if (scores["FourOfAKind"] === 0) {
        document.getElementById("FourOfAKind").textContent = berekenTotaalVanGelijkeWaarden(dobbelWaarden, 4);
    }
    if (scores["FullHouse"] === 0) {
        document.getElementById("FullHouse").textContent = berekenFullHouse(dobbelWaarden);
    }
    if (scores["SmallStraight"] === 0) {
        document.getElementById("SmallStraight").textContent = berekenStraten(dobbelWaarden, 4) ? 30 : 0;
    }
    if (scores["LargeStraight"] === 0) {
        document.getElementById("LargeStraight").textContent = berekenStraten(dobbelWaarden, 5) ? 40 : 0;
    }
    if (scores["Chance"] === 0) {
        document.getElementById("Chance").textContent = dobbelWaarden.reduce(function (acc, val) { // Reduce is om alles te rekenen, heel handig acc + val , acculator begint met 0.    val het waarde van getallen op de array.
            return acc + val;
        }, 0);
    }
}

    function krijgScoreId(waarde) { // Functie
        return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'][waarde - 1]; // Array met de cijfers 1-6 om te matchen, -1 want in JS beginnen arrays op 0
    }

    // Van een soort, de naam zegt het al. geef aan hoeveel dobbelstene van de zelfde waarde nodig om bijvoorbeeld threeof a kind te halen, (drie de zelfdde) 
    function berekenTotaalVanGelijkeWaarden(dobbelWaarden, vanEenSoort) { // Functie
        var totaal = 0; // Totaal begint met 0
        var tellingen = {}; // Bijhouden van aantal voorkomen van de dobbelstenen
        for (var i = 0; i < dobbelWaarden.length; i++) { // Loop door dobbelwaarde
            tellingen[dobbelWaarden[i]] = (tellingen[dobbelWaarden[i]] || 0) + 1; // Voor elke + in de array
        }
        for (var key in tellingen) { // Loop door properties
            if (tellingen.hasOwnProperty(key)) { // Als het van tellingen is dan 
                if (tellingen[key] >= vanEenSoort) { // Komt het dobbelwaarde vaker of gelijk voor 
                    totaal = dobbelWaarden.reduce(function (acc, val) { // Alles bij elkaar optellen weer met reduce
                        return acc + val; // Tellen
                    }, 0);
                    break; // Stoppen van de loop als er zelfde waardens gevonden zijn 
                }
            }
        }
        return totaal; // Return de totale waarden
    }

function berekenYahtzeeScore(dobbelWaarden) { // Functie
    var yahtzeeScore = 0; // Nu nog 0
    var countDice = [0, 0, 0, 0, 0, 0]; // Houd het aantal keer bij dat elke dobbelwaarde wordt gegooid

    for (var i = 0; i < 5; i++) { // Loop om elk cijfer te controleren
        var currentValue = parseInt(dobbelWaarden[i]); // Afronden (ParseInt maakt het een getal zonder decimalen)
        countDice[currentValue - 1]++; // Bij houden hoevaak welke waarde gegooit is 
    }

  
    for (var j = 0; j < 6; j++) { // loop 1 - 6
        if (countDice[j] >= 5) { // als 5 de gelijke
            yahtzeeScore = 50; // Als Yahtzee  score 50 
            break; // stoppen als er yahtzee is want je kan niet meerdere keren in 1 worp yahtzee gooien
        }
    }

    return yahtzeeScore; // score 0, of 50.
}

function berekenFullHouse(dobbelWaarden) { // Functie
        var tellingen = {}; // weer tellingen, object om waardes bij te houden
        for (var i = 0; i < dobbelWaarden.length; i++) { // loop voor dobbel waardes
            tellingen[dobbelWaarden[i]] = (tellingen[dobbelWaarden[i]] || 0) + 1; // Telen van keren dat een waarde word gegooit, + 1 als  als het er nog niet in zit
        }
        var heeftTwee = false; 
        var heeftDrie = false;
        for (var key in tellingen) { // Loop door tellingen 
            if (tellingen.hasOwnProperty(key)) { // Als het van tellingen is 
                if (tellingen[key] === 2) { // is tellin 2?
                    heeftTwee = true;
                } else if (tellingen[key] === 3) { // is tellin 3?
                    heeftDrie = true;
                }
            }
        }
        return heeftTwee && heeftDrie ? 25 : 0; // 25 is full house puntuh
    }

    function berekenStraten(dobbelWaarden, lengte) { // Functie
        var uniekeWaarden = Array.from(new Set(dobbelWaarden)); // Nieuwe array genaamd uniekewaarden , die dubbele cijfers verwijderen. dit is nodig voor straat wnt je wilt (1,2,3,4,5) bijvoorbeeld
        return uniekeWaarden.length >= lengte; // Als groter of gelijk, dan true, anders false en geen straat
    }

    function toggleVergrendelDobbelsteen(index) {  // Functie
        vergrendeldeDobbelstenen[index] = !vergrendeldeDobbelstenen[index]; // Als het gelocked was dan niet meer
        var dobbelsteenElement = document.getElementById('dobbel' + (index + 1)); // ophalen van dobbelsteen element, maar omdat het html is + 1 omdat html arrays op 1 beginnen
        if (vergrendeldeDobbelstenen[index]) { // controleren als het gelocked is of niet
            dobbelsteenElement.style.backgroundColor = "#FFCCCB";  // VEranderen van kleur voor locken en unlocken
        } else {
            dobbelsteenElement.style.backgroundColor = ""; 
        }
    }

    for (var i = 0; i < 5; i++) { // loop
        document.getElementById('dobbel' + (i + 1)).addEventListener('click', (function(index) { // id ophalen dobbel1-5 van index html en event listneer voegenn
            return function() {  // event listneer aan het juiste index koppelen
                toggleVergrendelDobbelsteen(index); // zorgen dat je juiste dobvbelsteen word gelocked
            }
        })(i));
    }

function kiesScore(scoreType) { // Functie 
    if (scores[scoreType] === 0 && worpenOver < 3) { // Controleer of de score nog niet is vastgezet en of er al is gerold
        var score = document.getElementById(scoreType).textContent; // Haal de score op
        scores[scoreType] = parseInt(score); // Zet de score om naar een getal en zet het vast

        // Update de totaalscore en toon het op het scherm
        var totaalScore = Object.values(scores).reduce(function (acc, val) { // Rekenen van totala score van scores objest
            return acc + val;
        }, 0);
        document.getElementById('totaalScore').textContent = totaalScore; // total score showen heel cool

        document.getElementById(scoreType).style.color = "grey"; // veranderen van kleur als je vast zet
        
        isScoreVastgezet = true; // is het vast gezxet ! TRUE!!! 

        resetWorpenEnDobbelstenen(); // Spreekt voor zich
    }
}


// Functie om rolls en locked te resseten na keuze
function resetWorpenEnDobbelstenen() { 
    worpenOver = 3; // Worpen terug naar 3
    document.getElementById('aantalWorpen').textContent = worpenOver + "/3 Rollen Over"; // texst resetten
    vergrendeldeDobbelstenen = [false, false, false, false, false]; // als dobbelsteen vergrenld true was naar false

    // kleuren resetten van lockingg
    for (var i = 0; i < 5; i++) {
        document.getElementById('dobbel' + (i + 1)).style.backgroundColor = "";
    }

    // dobbelwaardens die je had gegooit naar niets 
    for (var i = 0; i < 5; i++) {
        document.getElementById('dobbel' + (i + 1)).textContent = "";
    }
}
