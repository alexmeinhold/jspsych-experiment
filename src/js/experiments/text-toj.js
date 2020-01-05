import "jspsych/plugins/jspsych-html-keyboard-response";
import "jspsych/plugins/jspsych-survey-text";
import "jspsych/plugins/jspsych-fullscreen";
import { TojPlugin } from "../plugins/jspsych-toj";
import tojPlugin from "../plugins/jspsych-toj";

import { Scaler } from "../util/Scaler";
import { setAbsolutePosition } from "../util/positioning";

import { chooseRandomElement, randomPermutation } from "./helper.js";
import wordList from "./words.json";


const readingDuration = 400;
const leftKey = "f";
const rightKey = "j";

function generateWords() {
  const word = chooseRandomElement(wordList).toUpperCase();
  const shuffledWord = randomPermutation(word).toUpperCase();
  const probeElement = document.createElement('div');
  probeElement.innerHTML = word;
  const referenceElement = document.createElement('div');
  referenceElement.innerHTML = shuffledWord;
  return [probeElement, referenceElement];
}

export function createTimeline(jatosStudyInput = null) {
  let timeline = [];

  // timeline.push({
  //   type: "survey-text",
  //   questions: [{ prompt: "Please enter your subject number." }],
  //   data: {
  //     userAgent: navigator.userAgent,
  //   },
  // });

  // Switch to fullscreen
  timeline.push({
    type: "fullscreen",
    fullscreen_mode: true,
  });

  // Instructions
  timeline.push({
    type: "html-keyboard-response",
    stimulus:
      "<p>Sie sehen gleich ein Muster aus farbigen Strichen.<br/>" +
      "Zwei sind etwas größer als die anderen und werden kurz blinken.<br/>" +
      "Bitte beurteilen Sie, welcher zuerst geblinkt hat.</p>" +
      "<p>War es der linke, drücken Sie die Taste <b>F</b>.<br/>" +
      "Falls der rechte zuerst geblinkt hat, drücken Sie die Taste <b>J</b>.</p>" +
      "<p>Versuchen Sie, genau zu sein und keine Fehler zu machen. " +
      "Wenn Sie nicht wissen, wer zuerst war, raten Sie.</p>" +
      "<p>Press any key to start the experiment.</p>"
  });

  // Generate trials
  const factors = {
    probeLeft: [true, false],
    salient: [true, false],
    soa: [-150, -100, -50, 0, 50, 100, 150]
  };
  const repetitions = 1;
  let trials = jsPsych.randomization.factorial(factors, repetitions);

  let scaler; // Will store the Scaler object for the TOJ plugin

  // Create TOJ plugin trial object
  const toj = {
    type: "toj",
    modification_function: element => TojPlugin.flashElement(element, "toj-flash", 30),
    soa: jsPsych.timelineVariable("soa"),
    probe_key: () => (jsPsych.timelineVariable("probeLeft", true) ? leftKey : rightKey),
    reference_key: () => (jsPsych.timelineVariable("probeLeft", true) ? rightKey : leftKey),
    on_start: trial => {
      const probeLeft = jsPsych.timelineVariable("probeLeft", true);
      const salient = jsPsych.timelineVariable("salient", true);

      // Log probeLeft, salient and condition
      trial.data = {
        probeLeft,
        salient
      };

      trial.fixation_time = readingDuration;

      const [probeElement, referenceElement] = generateWords();

      trial.probe_element = probeElement;
      trial.reference_element = referenceElement;
      
      tojPlugin.appendElement(probeElement);
      tojPlugin.appendElement(referenceElement);

      setAbsolutePosition(probeElement, (probeLeft ? -1 : 1) * 140);
      setAbsolutePosition(referenceElement, (probeLeft ? 1 : -1) * 140);
    },

    on_load: () => {
      // Fit to window size
      scaler = new Scaler(
        document.getElementById("jspsych-toj-container"),
        400,
        400,
        0
      );
    },

    on_finish: () => {
      scaler.destruct();
    },
  };

  // Create TOJ timelines
  const tutorialTojTimeline = {
    timeline: [toj],
    timeline_variables: trials.slice(0, 10),
    randomize_order: true,
  };

  const experimentTojTimeline = {
    timeline: [toj],
    timeline_variables: trials,
    randomize_order: true,
  };

  // Generator function to create timeline variables for blocks
  const blockGenerator = function*(blockCount) {
    let currentBlock = 1;
    while (currentBlock <= blockCount) {
      yield { block: currentBlock, blockCount };
      currentBlock += 1;
    }
  };

  const tutorialFinishedScreen = {
    type: "html-keyboard-response",
    stimulus: "<p>You finished the tutorial.</p><p>Press any key to continue.</p>"
  };

  const blockFinishedScreen = {
    type: "html-keyboard-response",
    stimulus: () => {
      const block = jsPsych.timelineVariable("block", true);
      const blockCount = jsPsych.timelineVariable("blockCount", true);
      if (block < blockCount) {
        return `<p>You finished block ${block} of ${blockCount}.<p/><p>Press any key to continue.</p>`;
      } else {
        return "<p>This part of the experiment is finished. Press any key to save the results!</p>";
      }
    }
  };

  // Add tutorial to main timeline
  timeline.push(tutorialTojTimeline, tutorialFinishedScreen);

  // Add experiment blocks to main timeline
  timeline.push({
    timeline: [experimentTojTimeline, blockFinishedScreen],
    timeline_variables: Array.from(blockGenerator(1)),
  });

  return timeline;
}

export function getPreloadImagePaths() {
  return [];
}
