import "jspsych/plugins/jspsych-html-keyboard-response";
import "jspsych/plugins/jspsych-survey-text";
import "jspsych/plugins/jspsych-fullscreen";
import { TojPlugin } from "../plugins/jspsych-toj";
import tojPlugin from "../plugins/jspsych-toj";

import { Scaler } from "../util/Scaler";
import { setAbsolutePosition } from "../util/positioning";

import { chooseRandomElement, randomPermutation } from "./helper.js";
import wordList from "./words.json";

const readingDuration = 700;
const blockAmount = 8;

const leftKey = "u";
const rightKey = "v";

function generateWords() {
  const word = chooseRandomElement(wordList).toUpperCase();
  const shuffledWord = randomPermutation(word).toUpperCase();
  const probeElement = document.createElement("div");
  probeElement.innerHTML = word;
  const referenceElement = document.createElement("div");
  referenceElement.innerHTML = shuffledWord;
  return [probeElement, referenceElement];
}

export function createTimeline(jatosStudyInput = null) {
  let timeline = [];

  timeline.push({
    type: "survey-text",
    questions: [{ prompt: "Please enter your subject number." }],
    data: {
      userAgent: navigator.userAgent,
    },
  });

  // Switch to fullscreen
  timeline.push({
    type: "fullscreen",
    fullscreen_mode: true,
  });

  // Instructions
  timeline.push({
    type: "html-keyboard-response",
    stimulus: `
      <p style="text-align: center;"><strong>Willkommen zum Experiment.</strong></p>
      <p>Bevor Sie das Experiment fortf&uuml;hren k&ouml;nnen, fragen Sie sich, ob Sie die drei unteren Fragen bejaht beantworten k&ouml;nnen.</p>
      <ol>
      <li>Sind Sie in einer Umgebung, in der Sie ungest&ouml;rt f&uuml;r [X] Minuten an dem Experiment teilnehmen k&ouml;nnen?</li>
      <li>Haben Sie elektronische Ger&auml;te, au&szlig;er das Ger&auml;t an dem Sie gerade teilnehmen, ausgeschaltet oder in den Flugmodus gestellt?</li>
      <li>F&uuml;hlen Sie sich momentan wohl?</li>
      </ol>
      <p>Selbstverst&auml;ndlich ist ihnen &uuml;berlassen, das Experiement aufgrund von Unwohlseins jederzeit abzubrechen.</p>
      <p>W&auml;hrend des Experiments wird in der Mitte des Browserfensters ein schwarzer Kreis angezeigt werden. F&uuml;r die Dauer des Experimentes fokussieren Sie diesen. Um den Kreis, also oben und unten, wird jeweils ein Wort eingeblendet. Nach einer gewissen Zeit blinken beide W&ouml;rter auf. Sie sollen nun entscheiden, welches Wort zuerst geblinkt hat.</p>
      <ul style="list-style: none;">
      <li>F&uuml;r das obere Wort dr&uuml;cken Sie <strong>U</strong></li>
      <li>F&uuml;r das untere Wort dr&uuml;cken Sie <strong>V</strong></li>
      </ul>
      <p><em>Beide Tasten haben jeweils eine Einkerbung, an welcher Sie sich orientieren k&ouml;nnen.</em></p>
    `,
  });

  // Generate trials
  const factors = {
    probeLeft: [true, false],
    salient: [true, false],
    soa: [-150, -100, -50, 0, 50, 100, 150],
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
        salient,
      };

      trial.fixation_time = readingDuration;

      const [probeElement, referenceElement] = generateWords();

      trial.probe_element = probeElement;
      trial.reference_element = referenceElement;

      tojPlugin.appendElement(probeElement);
      tojPlugin.appendElement(referenceElement);

      setAbsolutePosition(probeElement, 0, (probeLeft ? -1 : 1) * 20);
      setAbsolutePosition(referenceElement, 0, (probeLeft ? 1 : -1) * 20);
    },

    on_load: () => {
      // Fit to window size
      scaler = new Scaler(document.getElementById("jspsych-toj-container"), 400, 400, 0);
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
    stimulus: "<p>You finished the tutorial.</p><p>Press any key to continue.</p>",
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
    },
  };

  // Add tutorial to main timeline
  timeline.push(tutorialTojTimeline, tutorialFinishedScreen);

  // Add experiment blocks to main timeline
  timeline.push({
    timeline: [experimentTojTimeline, blockFinishedScreen],
    timeline_variables: Array.from(blockGenerator(blockAmount)),
  });

  return timeline;
}

export function getPreloadImagePaths() {
  return [];
}
