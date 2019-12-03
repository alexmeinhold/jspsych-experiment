import "jspsych/plugins/jspsych-html-keyboard-response";
import { chooseRandomWord, randomPermutation } from "./helper.js";
import words from "./words.json";

const numberOfTrials = 10;
const timeline = [];

const welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};

timeline.push(welcome);

for (let trial = 0; trial < numberOfTrials; trial++) {
  const word = chooseRandomWord(words);
  const shuffled_word = randomPermutation(word);

  var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000
  }

  timeline.push(fixation);

  const showWords = {
    type: 'html-keyboard-response',
    stimulus: 
    `<div style="
          font-size:60px;
          display:flex;
          ">
      <div style="margin-right:300px;">${word}</div>
      <div>+</div>
      <div style="margin-left:300px;">${shuffled_word}</div>
    </div>`,
    trial_duration: 400
  }
  
  timeline.push(showWords);
  
  var blinkLeft = {
    type: 'html-keyboard-response',
    stimulus: 
    `<div style="
          font-size:60px;
          display:flex;
          ">
      <div style="margin-right:300px;color:rgb(130,130,130);">${word}</div>
      <div>+</div>
      <div style="margin-left:300px;">${shuffled_word}</div>
    </div>`,
    trial_duration: 50
  }
  
  timeline.push(blinkLeft);

  var pause = {
    type: 'html-keyboard-response',
    stimulus: 
    `<div style="
          font-size:60px;
          display:flex;
          ">
      <div style="margin-right:300px;">${word}</div>
      <div>+</div>
      <div style="margin-left:300px;">${shuffled_word}</div>
    </div>`,
    trial_duration: 0
  }
  
  timeline.push(pause);


  var blinkRight = {
    type: 'html-keyboard-response',
    stimulus: 
    `<div style="
          font-size:60px;
          display:flex;
          ">
      <div style="margin-right:300px;">${word}</div>
      <div>+</div>
      <div style="margin-left:300px;color:rgb(130,130,130);">${shuffled_word}</div>
    </div>`,
    trial_duration: 50
  }
  
  timeline.push(blinkRight);


  const waitForUser = {
    type: 'html-keyboard-response',
    stimulus: 
    `<div style="
          font-size:60px;
          display:flex;
          ">
      <div style="margin-right:300px;">${word}</div>
      <div>+</div>
      <div style="margin-left:300px;">${shuffled_word}</div>
    </div>`,
    choices: ['f', 'j'],
    on_finish: function(data) {
      if (data.key_press == 70) {
        // keycode of f is 70
        data.correct = true;
        console.log('correct');
      } else {
        data.correct = false;
        console.log('not correct');
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
