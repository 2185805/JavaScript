document.getElementById('rollknop').addEventListener('click', dobbelstenenGooien);

var worpenOver = 3;
var vergrendeldeDobbelstenen = [false, false, false, false, false];
var isScoreVastgezet = false;

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

function dobbelstenenGooien() {
    if (worpenOver > 0) {
        worpenOver--;

        document.getElementById('aantalWorpen').textContent = worpenOver + "/3 Rollen Over";

        var dobbelWaarden = [];
        for (var i = 0; i < 5; i++) {
            if (!vergrendeldeDobbelstenen[i]) {
                dobbelWaarden.push(Math.floor(Math.random() * 6) + 1);
            } else {
                dobbelWaarden.push(parseInt(document.getElementById('dobbel' + (i + 1)).textContent));
            }
        }

        for (var i = 0; i < dobbelWaarden.length; i++) {
            document.getElementById('dobbel' + (i + 1)).textContent = dobbelWaarden[i];
        }

        berekenEnToonScores(dobbelWaarden);
    }
}

function berekenEnToonScores(dobbelWaarden) {
    for (var i = 1; i <= 6; i++) {
        var count = dobbelWaarden.filter(function (waarde) {
            return waarde === i;
        }).length;

        if (scores[krijgScoreId(i)] === 0) {
            document.getElementById(krijgScoreId(i)).textContent = count * i;
        }
    }

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
        document.getElementById("Chance").textContent = dobbelWaarden.reduce(function (acc, val) {
            return acc + val;
        }, 0);
    }
}

function krijgScoreId(waarde) {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'][waarde - 1];
}

function berekenTotaalVanGelijkeWaarden(dobbelWaarden, vanEenSoort) {
    var totaal = 0;
    var tellingen = {};
    for (var i = 0; i < dobbelWaarden.length; i++) {
        tellingen[dobbelWaarden[i]] = (tellingen[dobbelWaarden[i]] || 0) + 1;
    }
    for (var key in tellingen) {
        if (tellingen.hasOwnProperty(key)) {
            if (tellingen[key] >= vanEenSoort) {
                totaal = dobbelWaarden.reduce(function (acc, val) {
                    return acc + val;
                }, 0);
                break;
            }
        }
    }
    return totaal;
}

function berekenYahtzeeScore(dobbelWaarden) {
    var yahtzeeScore = 0;
    var countDice = [0, 0, 0, 0, 0, 0];

    for (var i = 0; i < 5; i++) {
        var currentValue = parseInt(dobbelWaarden[i]);
        countDice[currentValue - 1]++;
    }

    for (var j = 0; j < 6; j++) {
        if (countDice[j] >= 5) {
            yahtzeeScore = 50;
            break;
        }
    }

    return yahtzeeScore;
}

function berekenFullHouse(dobbelWaarden) {
    var tellingen = {};
    for (var i = 0; i < dobbelWaarden.length; i++) {
        tellingen[dobbelWaarden[i]] = (tellingen[dobbelWaarden[i]] || 0) + 1;
    }
    var heeftTwee = false;
    var heeftDrie = false;
    for (var key in tellingen) {
        if (tellingen.hasOwnProperty(key)) {
            if (tellingen[key] === 2) {
                heeftTwee = true;
            } else if (tellingen[key] === 3) {
                heeftDrie = true;
            }
        }
    }
    return heeftTwee && heeftDrie ? 25 : 0;
}

function berekenStraten(dobbelWaarden, lengte) {
    var uniekeWaarden = Array.from(new Set(dobbelWaarden));
    return uniekeWaarden.length >= lengte;
}

function toggleVergrendelDobbelsteen(index) {
    vergrendeldeDobbelstenen[index] = !vergrendeldeDobbelstenen[index];
    var dobbelsteenElement = document.getElementById('dobbel' + (index + 1));
    if (vergrendeldeDobbelstenen[index]) {
        dobbelsteenElement.style.backgroundColor = "#FFCCCB";
    } else {
        dobbelsteenElement.style.backgroundColor = "";
    }
}

for (var i = 0; i < 5; i++) {
    document.getElementById('dobbel' + (i + 1)).addEventListener('click', (function(index) {
        return function() {
            toggleVergrendelDobbelsteen(index);
        }
    })(i));
}

function kiesScore(scoreType) {
    if (scores[scoreType] === 0 && worpenOver < 3) {
        var score = document.getElementById(scoreType).textContent;
        scores[scoreType] = parseInt(score);

        var totaalScore = Object.values(scores).reduce(function(acc, val) {
            return acc + val;
        }, 0);
        document.getElementById('totaalScore').textContent = totaalScore;

        document.getElementById(scoreType).style.color = "grey";

        isScoreVastgezet = true;

        resetWorpenEnDobbelstenen();
    }
}

function resetWorpenEnDobbelstenen() {
    worpenOver = 3;
    document.getElementById('aantalWorpen').textContent = worpenOver + "/3 Rollen Over";
    vergrendeldeDobbelstenen = [false, false, false, false, false];

    for (var i = 0; i < 5; i++) {
        document.getElementById('dobbel' + (i + 1)).style.backgroundColor = "";
    }

    for (var i = 0; i < 5; i++) {
        document.getElementById('dobbel' + (i + 1)).textContent = "";
    }
}
