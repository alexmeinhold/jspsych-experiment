import "jspsych/plugins/jspsych-html-keyboard-response";
import { chooseRandomElement, randomPermutation, shuffleArray } from "./helper.js";
import wordList from "./words.json";

const numberOfTrials = 10;
const soaValues = [-100, -80, -50, -30, -20, -10, 0, 10, 20, 30, 50, 80, 100];
const readingDuration = 300;
const blinkingDuration = 100;

const timeline = [];

const welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};

timeline.push(welcome);

for (let trial = 0; trial < numberOfTrials; trial++) {
  const word = chooseRandomElement(wordList);
  const shuffledWord = randomPermutation(word);
  const words = shuffleArray([word, shuffledWord]);
  const blinkingOrder = shuffleArray(['left', 'right'])

  var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 200
  }
  
  timeline.push(fixation);

  const showWords = {
    type: 'html-keyboard-response',
    stimulus: renderWords(words[0], words[1]),
    trial_duration: readingDuration
  }
  
  timeline.push(showWords);
  
  var blinkFirst = {
    type: 'html-keyboard-response',
    stimulus: renderWords(words[0], words[1], blinkingOrder[0]),
    trial_duration: blinkingDuration
  }
        
  timeline.push(blinkFirst);

  var soaPause = {
    type: 'html-keyboard-response',
    stimulus: renderWords(words[0], words[1]),
    trial_duration: Math.max(0, chooseRandomElement(soaValues) - blinkingDuration)
  }

  timeline.push(soaPause);

  var blinkSecond = {
    type: 'html-keyboard-response',
    stimulus: renderWords(words[0], words[1], blinkingOrder[1]),
    trial_duration: blinkingDuration
  }
  
  timeline.push(blinkSecond);
  
  const waitForUser = {
    type: 'html-keyboard-response',
    stimulus: renderWords(words[0], words[1]),
    choices: ['f', 'j'],
    on_finish: function(data) {
      const firstToBlink = blinkingOrder[0];
      if (data.key_press == 70 && firstToBlink == 'left' || data.key_press == 74 && firstToBlink == 'right') {
        // keycode of f is 70, keycode of j is 74
        data.correct = true;
        console.log('correct');
      } else {
        data.correct = false;
        console.log('not correct')
      }
    },
  }
  
  timeline.push(waitForUser);
}

jsPsych.init({
  timeline: timeline,
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

function renderWords(firstWord, secondWord, blinking) {
  return `<div style="
            font-size:60px;
            display:flex;
            ">
            <div style="margin-right:300px;${(blinking === 'left') ? 'color:rgb(130,130,130);' : ''}">${firstWord}</div>
            <div>+</div>
            <div style="margin-left:300px;${(blinking === 'right') ? 'color:rgb(130,130,130);' : ''}">${secondWord}</div>
          </div>`;
}
