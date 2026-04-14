//1z 2x 3n 4m
let songPlay = false;

//timing variables
let songStartTime;
let lastBeatIndex = -1;
let selectedSongIndex = -1;

//notes + songs
let Znotes = [];
let Xnotes = [];
let Nnotes = [];
let Mnotes = [];

let selectedSong;
let musica_electronica, heart_pop, harajuku_girl, i_dont_go_to_parties, harvest_sky;

//score
let score = 0;
let m_e_scores = [];
let h_p_scores = [];
let h_g_scores = [];
let idgtp_scores = [];
let h_s_scores = [];
let highScore_m_e, highScore_h_p, highScore_h_g, highScore_idgtp, highScore_h_s;

let missCount = 0;
let badCount = 0;
let mehCount = 0;
let goodCount = 0;
let perfectCount = 0;

let bg;
let isGreen = true;
let startScreen = true;
let selectScreen = false;
let playScreen = false;
let finishScreen = false;
let buttonx = 385;
let buttony = 450;
let buttonw = 130;
let buttonh = 30;
let songw = 110;
let songh = 110;
let songs = [];

function preload() {
  aerofont = loadFont("assets/fonts/Frutiger.ttf");
  aeroboldfont = loadFont("assets/fonts/Frutiger_bold.ttf");
  aerologo = loadFont("assets/fonts/Planetkosmos.ttf");
  menuost = loadSound("assets/songs/menu-ost.mp3");
  selectost = loadSound("assets/songs/select-ost.mp3");
  bubble = loadSound("assets/buble.mp3");
  aerologoimg = loadImage("assets/aerologo.png");
  selectlogoimg = loadImage("assets/songselectlogo.png");
  durationimg = loadImage("assets/duration.png");
  highestscoreimg = loadImage("assets/highestscore.png");
  bg = loadImage("assets/background.png");
  grass = loadImage("assets/grass.png");
  homewindow = loadImage("assets/homewindow.png");
  selectwindow = loadImage("assets/selectwindow.png");
  playwindow = loadImage("assets/playwindow.png");
  finishwindow = loadImage("assets/finishwindow.png");
  keypress = loadImage("assets/keypress.png");
  noteblock = loadImage("assets/note.png");
  song1 = loadImage("assets/song1.png");
  song2 = loadImage("assets/song2.png");
  song3 = loadImage("assets/song3.png");
  song4 = loadImage("assets/song4.png");
  song5 = loadImage("assets/song5.png");
  white = color(255);
  green = color(147, 195, 59);
  darkgreen = color(102, 147, 18);
  lightblue = color(223, 245, 254);
  blue = color(57, 144, 215);
  darkblue = color(8, 47, 115);
  //songs
  musica_electronica = loadSound("assets/songs/musica_electronica.wav"); //120bpm
  heart_pop = loadSound("assets/songs/heart_pop.wav"); //142bpm
  harajuku_girl = loadSound("assets/songs/harajuku_girl.wav"); //139bpm
  i_dont_go_to_parties = loadSound("assets/songs/i_dont_go_to_parties.wav"); //134bpm
  harvest_sky = loadSound("assets/songs/harvest_sky.wav"); //135bpm
}

class note {
  constructor(noteType, bpm) { //value 1-4
    if (noteType == 1) {
      this.x = 103;
    }
    else if (noteType == 2) {
      this.x = 287;
    }
    else if (noteType == 3) {
      this.x = 460;
    }
    else if (noteType == 4) {
      this.x = 460 + 185;
    }

    this.y = 0;
    this.timer = 0;
    this.noteType = noteType;
    this.fourthNoteMs = (60 / bpm * 4) * 1000;
    this.spawnTime = millis();
    this.showing = true;
  }

  show() {
    if (this.y < 480) {
      image(noteblock, this.x, this.y, 158, 23);
    }
    else {

      if (this.showing) {
        //miss if y below 475
        console.log("miss");
        score -= 100;
        missCount++;
        this.showing = false;
        bubble.play();
      }
    }
  }

  fall() {
    this.timer = millis() - this.spawnTime;
    this.y = map(this.timer, 0, this.fourthNoteMs, 150, height - 100);
  }

  hit() {

    //score feedback
    if (this.y < 395) {
      console.log("bad");
      score -= 10;
      badCount++;
    }
    else if (this.y < 425 && this.y > 395) {
      console.log("meh")
      score += 50;
      mehCount++;
    }
    else if (this.y > 425 && this.y < 455) {
      console.log("good");
      score += 100;
      goodCount++;
    }
    else if (this.y > 455 && this.y < 485) {
      console.log("perfect")
      score += 300;
      perfectCount++;
    }

    //removing notes from the array
    if (this.noteType == 1) {
      Znotes.splice(0, 1);
    }
    else if (this.noteType == 2) {
      Xnotes.splice(0, 1);
    }
    else if (this.noteType == 3) {
      Nnotes.splice(0, 1);
    }
    else if (this.noteType == 4) {
      Mnotes.splice(0, 1);
    }
  }
}

function setup() {
  createCanvas(900, 600);
  lastSecond = second();
  outputVolume(0.5);
  menuost.loop();
  textAlign(CENTER);
  cursor("assets/cursor.png");

  songs = [
    { img: song1, x: 125, y: 265 },
    { img: song2, x: 130 + 130, y: 265 },
    { img: song3, x: 260 + 130, y: 265 },
    { img: song4, x: 395 + 130, y: 265 },
    { img: song5, x: 530 + 130, y: 265 }
  ];
}

function draw() {
  background(bg);

  highScore_m_e = max(m_e_scores);
  highScore_h_p = max(h_p_scores);
  highScore_h_g = max(h_g_scores);
  highScore_idgtp = max(idgtp_scores);
  highScore_h_s = max(h_s_scores);

  console.log(highScore_h_s);

  if (startScreen) {
    startmenu();
  }

  if (selectScreen) {
    selectmenu();

    for (let i = 0; i < songs.length; i++) {
      let s = songs[i];

      let isHovering =
        mouseX > s.x &&
        mouseX < s.x + songw &&
        mouseY > s.y &&
        mouseY < s.y + songh;

      let isSelected = i == selectedSongIndex;

      let scaleFactor = (isHovering || isSelected) ? 1.1 : 1;

      let newW = songw * scaleFactor;
      let newH = songh * scaleFactor;

      let offsetX = (newW - songw) / 2;
      let offsetY = (newH - songh) / 2;

      image(s.img, s.x - offsetX, s.y - offsetY, newW, newH);
    }
  }

  if (playScreen) {
    playmenu();
    let songArray;

    if (selectedSong == musica_electronica) {
      image(song3, 550, 64, 55, 55);
      songArray = array_m_e;
    }
    else if (selectedSong == heart_pop) {
      image(song2, 550, 64, 55, 55);
      songArray = array_h_p;
    }
    else if (selectedSong == harajuku_girl) {
      image(song5, 550, 64, 55, 55);
      songArray = array_h_g;
    }
    else if (selectedSong == i_dont_go_to_parties) {
      image(song1, 550, 64, 55, 55);
      songArray = array_idgtp;
    }
    else if (selectedSong == harvest_sky) {
      image(song4, 550, 64, 55, 55);
      songArray = array_h_s;
    }

    if (songPlay == true && 4 < beatIndex <= songArray.length) {

      countBeats(songArray, selectedSong);
      drawSong();


      push();
      textFont(aerofont);
      textAlign(LEFT);
      fill(darkblue);
      noStroke();
      text("Score: " + score, 715, 105)
      pop();

      let totalLen = selectedSong.duration();
      let currentPos = selectedSong.currentTime();

      push();
      textFont(aerofont);
      textAlign(LEFT);
      fill(darkblue);
      noStroke();
      text("Duration: " + nf(currentPos, 0, 2) + " / " + nf(totalLen, 0, 2) + "s", 630, 83);
      pop();

      // progress bar background
      fill(lightblue);
      stroke(darkblue);
      strokeWeight(.5);
      rect(65, 65, 465, 10, 10);

      // progress fill
      let progressBarWidth = map(currentPos, 0, totalLen, 0, 465);
      progressBarWidth = constrain(progressBarWidth, 0, 465);
      fill(green);
      rect(65, 65, progressBarWidth, 10, 10);

      if (songPlay && selectedSong && !selectedSong.isPlaying()) {
        songPlay = false;
        finishScreen = true;
      }
    }
  }

  if (finishScreen) {
    finishmenu();
  }
}

function startmenu() {
  image(homewindow, 50, 50, 800, 500);
  image(grass, 0, 520, 900, 80);
  image(aerologoimg, 552, 195, 221, 94);
  noStroke();
  fill(darkblue);
  textSize(12);
  textFont(aeroboldfont);
  image(keypress, 543, 358, 193, 43);
  text("Press the keys to the beat.", 640, 312);
  text("Aim for the highest score!", 640, 333);
  text("Press enter to play.", 640, 423);
}

function selectmenu() {
  image(selectwindow, 50, 50, 800, 500);
  image(grass, 0, 520, 900, 80);
  image(selectlogoimg, 280, 175, 348, 71);
  image(durationimg, 155, 445, 138, 45);
  image(highestscoreimg, 560, 445, 215, 45);
  push();
  textFont(aeroboldfont);
  noStroke();
  textSize(12);
  fill(darkblue);
  text("i don't go to parties (rmx.)", 180, 400);
  text("heart pop", 315, 400);
  text("musica electronica", 445, 400);
  text("harvest sky", 580, 400);
  text("harajuku girl", 715, 400);
  textFont(aerofont);
  text("gabemtnz", 180, 415);
  text("yeil", 315, 415);
  text("yaego", 445, 415);
  text("oklou", 580, 415);
  text("clark rainbow", 715, 415);
  pop();
  push();
  textAlign(CENTER);
  textSize(18);
  stroke(white);
  strokeWeight(5);
  fill(blue);
  textFont(aerologo);
  text(getScoreByIndex(selectedSongIndex), 665, 510);

  let durationText = "n.a";

  if (selectedSong) {
    durationText = nf(selectedSong.duration(), 0, 2) + "s";
  }

  text(durationText, 215, 510);
  pop();

  for (let s of songs) {
    let isHovering =
      mouseX > s.x &&
      mouseX < s.x + songw &&
      mouseY > s.y &&
      mouseY < s.y + songh;

    let scaleFactor = isHovering ? 1.1 : 1;

    let newW = songw * scaleFactor;
    let newH = songh * scaleFactor;

    let offsetX = (newW - songw) / 2;
    let offsetY = (newH - songh) / 2;

    image(s.img, s.x - offsetX, s.y - offsetY, newW, newH);
  }

  if (isGreen) {
    stroke(darkgreen);
    strokeWeight(1);
    drawGradient(buttonx, buttony, buttonw, buttonh, 25,
      "#E6FFB9", "#EFFDD6", "#93C33B"
    );
    push();
    textFont(aeroboldfont);
    noStroke();
    textSize(14);
    fill(darkgreen);
    text("Play", buttonx + 65, buttony + 20);
    pop();
  } else {
    stroke(darkblue);
    strokeWeight(1);
    drawGradient(buttonx, buttony, buttonw, buttonh, 25,
      "#81D3FA", "#C3ECFF", "#3990D7"
    );
    push();
    textFont(aeroboldfont);
    noStroke();
    textSize(14);
    fill(darkblue);
    text("Play", buttonx + 65, buttony + 20);
    pop();
  }

  if (mouseX > buttonx && mouseX < buttonx + buttonw &&
    mouseY > buttony && mouseY < buttony + buttonh) {
    isGreen = false;
  } else { isGreen = true; }
}

function scoreMax(arr) {
  if (arr.length === 0) {
    return "n.a";
  }
  return max(arr);
}

function getScoreByIndex(i) {
  if (i == 2) return scoreMax(m_e_scores);
  if (i == 1) return scoreMax(h_p_scores);
  if (i == 4) return scoreMax(h_g_scores);
  if (i == 0) return scoreMax(idgtp_scores);
  if (i == 3) return scoreMax(h_s_scores);
  return "n.a";
}

function playmenu() {
  image(playwindow, 50, 50, 800, 500);
  image(grass, 0, 520, 900, 80);
}

function drawGradient(x, y, w, h, r, c1, c2, c3) {
  let ctx = drawingContext;

  let grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.45, c2);
  grad.addColorStop(0.93, c3);

  ctx.fillStyle = grad;
  rect(x, y, w, h, r);
}

function finishmenu() {
  image(finishwindow, 325, 163, 258, 293);
  push();
  textAlign(LEFT);
  textSize(20);
  textFont(aerologo);
  stroke(blue);
  strokeWeight(5);
  fill(white);
  text(missCount, 400, 295);
  text(badCount, 480, 295);
  text(mehCount, 400, 350);
  text(goodCount, 480, 350);
  stroke(darkblue);
  text(perfectCount, 480, 385);
  stroke(green);
  text(score, 470, 420);
  pop();
}

function mousePressed() {

  if (selectScreen) {
    if (mouseX > buttonx && mouseX < buttonx + buttonw &&
      mouseY > buttony && mouseY < buttony + buttonh) {
      selectScreen = false;
      playScreen = true;
      selectost.stop();

      beatIndex = 0;
      score = 0;
      missCount = 0;
      badCount = 0;
      mehCount = 0;
      goodCount = 0;
      perfectCount = 0;
    }

    for (let i = 0; i < songs.length; i++) {
      let s = songs[i];

      if (
        mouseX > s.x &&
        mouseX < s.x + songw &&
        mouseY > s.y &&
        mouseY < s.y + songh
      ) {
        selectedSongIndex = i;
        selectedSong = songs[i].sound;

        if (i == 0) selectedSong = i_dont_go_to_parties;
        if (i == 1) selectedSong = heart_pop;
        if (i == 2) selectedSong = musica_electronica;
        if (i == 3) selectedSong = harvest_sky;
        if (i == 4) selectedSong = harajuku_girl;
      }
    }
  }
}

function keyPressed() {

  if (startScreen) {
    if (keyCode == 13) {
      startScreen = false;
      selectScreen = true;
      menuost.stop();
      selectost.loop();
    }
  }

  if (selectScreen) {
    if (keyCode == 27) {
      startScreen = true;
      selectScreen = false;
      menuost.loop();
      selectost.stop();
      isGreen = true;
      selectedSongIndex = -1;
    }
  }

  if (playScreen) {
    //starting and stopping song
    if (keyCode === 13 && !finishScreen && !songPlay) {
      songPlay = true;
      songStartTime = millis();
    }

    if (keyCode == 27) {
      selectScreen = true;
      playScreen = false;
      selectost.loop();
      isGreen = true;
      songPlay = false;
      selectedSong.stop();

      Znotes = [];
      Xnotes = [];
      Nnotes = [];
      Mnotes = [];

      //save scores for song when press esc
      if (selectedSong == musica_electronica) {
        m_e_scores.push(score);
      }
      else if (selectedSong == heart_pop) {
        h_p_scores.push(score);
      }
      else if (selectedSong == harajuku_girl) {
        h_g_scores.push(score);
      }
      else if (selectedSong == i_dont_go_to_parties) {
        idgtp_scores.push(score);
      }
      else if (selectedSong == harvest_sky) {
        h_s_scores.push(score);
      }
    }

    //pressing notes
    if (songPlay) {
      if (key === "z" && Znotes.length > 0) {
        Znotes[0].hit();
      }

      if (key === "x" && Xnotes.length > 0) {
        Xnotes[0].hit();
      }

      if (key === "n" && Nnotes.length > 0) {
        Nnotes[0].hit();
      }

      if (key === "m" && Mnotes.length > 0) {
        Mnotes[0].hit();
      }
    }
  }

  if (finishScreen) {
    if (keyCode == 27) {
      playScreen = false;
      finishScreen = false;
      selectScreen = true;
      selectost.loop();
    }
  }
}

function countBeats(arr, songFile) {
  let bpm = arr[0];
  let sixteenth = (60 / bpm / 4) * 1000;
  let song = songFile;

  let beatIndex = Math.floor((millis() - songStartTime) / sixteenth);

  if (songPlay && !song.isPlaying() && beatIndex < arr.length) {
    song.play();
  }

  if (beatIndex !== lastBeatIndex) {
    lastBeatIndex = beatIndex;

    // trigger note spawn here
    let fallingBeat = beatIndex + 4;

    if (fallingBeat < arr.length) {

      if (arr[fallingBeat] == 1) {
        let z = new note(1, bpm);
        Znotes.push(z);
      }
      else if (arr[fallingBeat] == 2) {
        let x = new note(2, bpm);
        Xnotes.push(x);
      }
      else if (arr[fallingBeat] == 3) {
        let n = new note(3, bpm);
        Nnotes.push(n);
      }
      else if (arr[fallingBeat] == 4) {
        let m = new note(4, bpm);
        Mnotes.push(m);
      }
    }
  }
  push();
  textFont(aerofont);
  textAlign(LEFT);
  fill(darkblue);
  noStroke();
  text("Beat: " + beatIndex, 630, 105);
  pop();
}

function drawSong() {

  for (let i = Znotes.length - 1; i >= 0; i--) {
    if (Znotes[i].timer >= Znotes[i].fourthNoteMs) {
      Znotes.splice(i, 1); // remove self when note timer over
    } else {
      Znotes[i].fall();
      Znotes[i].show();
    }
  }

  for (let i = Xnotes.length - 1; i >= 0; i--) {
    if (Xnotes[i].timer >= Xnotes[i].fourthNoteMs) {
      Xnotes.splice(i, 1); // remove self when note timer over
    } else {
      Xnotes[i].fall();
      Xnotes[i].show();
    }
  }

  for (let i = Nnotes.length - 1; i >= 0; i--) {
    if (Nnotes[i].timer >= Nnotes[i].fourthNoteMs) {
      Nnotes.splice(i, 1); // remove self when note timer over
    } else {
      Nnotes[i].fall();
      Nnotes[i].show();
    }
  }

  for (let i = Mnotes.length - 1; i >= 0; i--) {
    if (Mnotes[i].timer >= Mnotes[i].fourthNoteMs) {
      Mnotes.splice(i, 1); // remove self when note timer over
    } else {
      Mnotes[i].fall();
      Mnotes[i].show();
    }
  }
}

//credits:
//menu ost: alyzea - sunset resort
//start ost: Webinar™ - Bonus Fruit I
//finish ost: Xploshi - Showcase

//song1: gabemtnz - i don't go to parties and i only know 3 dance moves from 2017 (remix)
//song2: yeil - heart pop
//song3: yaego - musica electronica
//song4: oklou - harvest sky
//song5: clark rainbow - harajuku girl

//fonts: Frutiger and Planet Kosmos
//assets: png images from https://frutigeraeroarchive.org
//windows 7 ui (aero ui): partially credited to dlphesigns on Figma
