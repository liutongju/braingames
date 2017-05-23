// SSI stuff
var SSI_ids = [jsPsych.data.getURLVariable('psid'), jsPsych.data.getURLVariable('pid')]; // debug with ?psid=<whatever>&pid=test
var basicCode = 40932;

var cycles = 3;                        // how many iterations per stimulus for proper response averaging
var score = 0, accY = 100, accN = -50; // keeping score

// for some reason, (try to) shut it down
function kill(reason) {
  jsPsych.data.addProperties({ status: 'disqualified' });
  $.ajax({
    type: 'post',
    cache: false,
    dataType: 'text',
    url: 'datacollector/',
    contentType: 'application/json; charset=utf-8',
    headers: {
        'X-CSRFToken': '{{  csrf_token }}'
    },
    data: jsPsych.data.get().json(),
    error: function(output, textStatus) {
      console.log(textStatus);
    },
    success: function(output) {
      console.log(output);
      if (SSI_ids[1] != 'test') {
        alert(reason);
        window.location.replace("http://dkr1.ssisurveys.com/projects/end?rst=2&psid="+SSI_ids[0]); // URL for SSI redirect
      } else {
        alert(reason); // redirect kills the script, nothing else I found could do it so it will just loop here
      }
    }
  });
}
// if nothing passed just kill the script
if (SSI_ids[0] == null || SSI_ids[1] == null) { kill("SSI url variables not present, will not execute study."); }

// check for reload (if there's a cookie they've been here before [admittedly naive assumption])
if( typeof Cookies.get().ba !== 'undefined' ) {
  // yes cookie
  if (Cookies.getJSON('ba').r >= 1) {
    Cookies.set('ba', {"r": Cookies.getJSON('ba').r += 1});
    kill("Page reload detected, will not continue study; disqualification.");
  } 
} else {
  // no cookie
  if (SSI_ids[1] != 'test') { Cookies.set('ba', {"r":0}); }
}

// specify all stimuli and levels of related IVs (ps I sorta hate editing this, would rather see it in a spreadsheet?)
var video_clips = [
  // {sources:["{{ gamestatic('vid/C_1_lag2.mp4') }}"],  data: [{first: 'Chrome',  clip: 1, speed: 'lag2',  correct: 'Firefox', correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/C_1_lag1.mp4') }}"],  data: [{first: 'Chrome',  clip: 1, speed: 'lag1',  correct: 'Firefox', correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/C_1_same.mp4') }}"],  data: [{first: 'Chrome',  clip: 1, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  // {sources:["{{ gamestatic('vid/C_1_lead1.mp4') }}"], data: [{first: 'Chrome',  clip: 1, speed: 'lead1', correct: 'Chrome',  correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/C_1_lead2.mp4') }}"], data: [{first: 'Chrome',  clip: 1, speed: 'lead2', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_2_lag2.mp4') }}"],  data: [{first: 'Chrome',  clip: 2, speed: 'lag2',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_2_lag1.mp4') }}"],  data: [{first: 'Chrome',  clip: 2, speed: 'lag1',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_2_same.mp4') }}"],  data: [{first: 'Chrome',  clip: 2, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/C_2_lead1.mp4') }}"], data: [{first: 'Chrome',  clip: 2, speed: 'lead1', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_2_lead2.mp4') }}"], data: [{first: 'Chrome',  clip: 2, speed: 'lead2', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_3_lag2.mp4') }}"],  data: [{first: 'Chrome',  clip: 3, speed: 'lag2',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_3_lag1.mp4') }}"],  data: [{first: 'Chrome',  clip: 3, speed: 'lag1',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_3_same.mp4') }}"],  data: [{first: 'Chrome',  clip: 3, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/C_3_lead1.mp4') }}"], data: [{first: 'Chrome',  clip: 3, speed: 'lead1', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_3_lead2.mp4') }}"], data: [{first: 'Chrome',  clip: 3, speed: 'lead2', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_4_lag2.mp4') }}"],  data: [{first: 'Chrome',  clip: 4, speed: 'lag2',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_4_lag1.mp4') }}"],  data: [{first: 'Chrome',  clip: 4, speed: 'lag1',  correct: 'Firefox', correctKey: 74}]},
  {sources:["{{ gamestatic('vid/C_4_same.mp4') }}"],  data: [{first: 'Chrome',  clip: 4, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/C_4_lead1.mp4') }}"], data: [{first: 'Chrome',  clip: 4, speed: 'lead1', correct: 'Chrome',  correctKey: 70}]},
  {sources:["{{ gamestatic('vid/C_4_lead2.mp4') }}"], data: [{first: 'Chrome',  clip: 4, speed: 'lead2', correct: 'Chrome',  correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/C_5_lag2.mp4') }}"],  data: [{first: 'Chrome',  clip: 5, speed: 'lag2',  correct: 'Firefox', correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/C_5_lag1.mp4') }}"],  data: [{first: 'Chrome',  clip: 5, speed: 'lag1',  correct: 'Firefox', correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/C_5_same.mp4') }}"],  data: [{first: 'Chrome',  clip: 5, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  // {sources:["{{ gamestatic('vid/C_5_lead1.mp4') }}"], data: [{first: 'Chrome',  clip: 5, speed: 'lead1', correct: 'Chrome',  correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/C_5_lead2.mp4') }}"], data: [{first: 'Chrome',  clip: 5, speed: 'lead2', correct: 'Chrome',  correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/F_1_lag2.mp4') }}"],  data: [{first: 'Firefox', clip: 1, speed: 'lag2',  correct: 'Chrome',  correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/F_1_lag1.mp4') }}"],  data: [{first: 'Firefox', clip: 1, speed: 'lag1',  correct: 'Chrome',  correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/F_1_same.mp4') }}"],  data: [{first: 'Firefox', clip: 1, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  // {sources:["{{ gamestatic('vid/F_1_lead1.mp4') }}"], data: [{first: 'Firefox', clip: 1, speed: 'lead1', correct: 'Firefox', correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/F_1_lead2.mp4') }}"], data: [{first: 'Firefox', clip: 1, speed: 'lead2', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_2_lag2.mp4') }}"],  data: [{first: 'Firefox', clip: 2, speed: 'lag2',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_2_lag1.mp4') }}"],  data: [{first: 'Firefox', clip: 2, speed: 'lag1',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_2_same.mp4') }}"],  data: [{first: 'Firefox', clip: 2, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/F_2_lead1.mp4') }}"], data: [{first: 'Firefox', clip: 2, speed: 'lead1', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_2_lead2.mp4') }}"], data: [{first: 'Firefox', clip: 2, speed: 'lead2', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_3_lag2.mp4') }}"],  data: [{first: 'Firefox', clip: 3, speed: 'lag2',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_3_lag1.mp4') }}"],  data: [{first: 'Firefox', clip: 3, speed: 'lag1',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_3_same.mp4') }}"],  data: [{first: 'Firefox', clip: 3, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/F_3_lead1.mp4') }}"], data: [{first: 'Firefox', clip: 3, speed: 'lead1', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_3_lead2.mp4') }}"], data: [{first: 'Firefox', clip: 3, speed: 'lead2', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_4_lag2.mp4') }}"],  data: [{first: 'Firefox', clip: 4, speed: 'lag2',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_4_lag1.mp4') }}"],  data: [{first: 'Firefox', clip: 4, speed: 'lag1',  correct: 'Chrome',  correctKey: 74}]},
  {sources:["{{ gamestatic('vid/F_4_same.mp4') }}"],  data: [{first: 'Firefox', clip: 4, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  {sources:["{{ gamestatic('vid/F_4_lead1.mp4') }}"], data: [{first: 'Firefox', clip: 4, speed: 'lead1', correct: 'Firefox', correctKey: 70}]},
  {sources:["{{ gamestatic('vid/F_4_lead2.mp4') }}"], data: [{first: 'Firefox', clip: 4, speed: 'lead2', correct: 'Firefox', correctKey: 70}]} // deleted comma
  // {sources:["{{ gamestatic('vid/F_5_lag2.mp4') }}"],  data: [{first: 'Firefox', clip: 5, speed: 'lag2',  correct: 'Chrome',  correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/F_5_lag1.mp4') }}"],  data: [{first: 'Firefox', clip: 5, speed: 'lag1',  correct: 'Chrome',  correctKey: 74}]},
  // {sources:["{{ gamestatic('vid/F_5_same.mp4') }}"],  data: [{first: 'Firefox', clip: 5, speed: 'same',  correct: 'Same',    correctKey: 32}]},
  // {sources:["{{ gamestatic('vid/F_5_lead1.mp4') }}"], data: [{first: 'Firefox', clip: 5, speed: 'lead1', correct: 'Firefox', correctKey: 70}]},
  // {sources:["{{ gamestatic('vid/F_5_lead2.mp4') }}"], data: [{first: 'Firefox', clip: 5, speed: 'lead2', correct: 'Firefox', correctKey: 70}]}
];
var all_trials = jsPsych.randomization.repeat(video_clips, cycles);  // specify here with 2nd arg how many repetitions of each trial

var timeline = [];                                                   // empty timeline .push all trials to it before .init to run study

var instructions_block = {
  type: 'instructions',
  pages: [   // "<p></p>",
    "<h3>Thank you for your participation in this \"BrainGame\"</h3>" +
    "<p>BrainGames use research techniques from cognitive science<br>to better understand how our minds work when using the web</p>" +
    "<p>That understanding can improve web experiences by<br>tailoring them around data contributed through your participation</p>" +
    "<p>Left and right arrow keys navigate<br>back and forward through the instructions</p>",

    "<p><strong>Please do NOT do any of the following things,<br>or you will be disqualified to prevent invalidating results:</strong></p>" +
    "<ul><li>Hit ESC to exit fullscreen mode</li><li>Switch tabs or programs during the procedure</li><li>Zoom in or out</li><li>Reload the page once you have begun trials</li></ul>" +
    "<p>You will be taken out of fullscreen mode after completing the study</p>",

    "<p>On each trial of this experiment you will see two video clips of<br>web pages loading back-to-back in <b>different browsers</b></p>" +
    "<p>Please pay close attention to how quickly the two pages load in the clips -<br>one browser <i>may</i> load the page more quickly than the other</p>",

    "<p><u>After</u> each pair of videos has played<br>you will be asked which clip, <i>if either,</i> loaded the page <b>fastest</b></p>" +
    "<p>The differences are very slight and can be difficult to notice</p>" +
    "<img src='{{ gamestatic('img/instAnswer.png') }}'></img>" +
    "<p><i>Sometimes</i> there is no difference, though<br>That option is <u>also</u> available to respond with</p>",
    
    "<p>Rest your index fingers on the 'F' and 'J' keys and your thumbs on the space bar</p>" +
    "<p>Press 'f' if the 1st clip loaded faster, 'j' if the 2nd clip loaded faster,<br>or space for the trials where the clips play at the same speed<br>(Answer screens remind you of the exact keys)</p>" +
    "<img src='{{ gamestatic('img/instAnswer.png') }}'></img> " + " <img src='{{ gamestatic('img/keyhands.jpg') }}'></img>" + "<p>Key responses keep the trials moving along quickly</p>",

    "<p>Error tones are provided for feedback after each response<br>Get familiar with the correct and incorrect sounds below and adjust your volume:<br>" +
    "Correct: <audio controls=1><source src={{ gamestatic('wav/pos.wav') }} type='audio/wav'></audio><br>" +
    "Incorrect: <audio controls=2><source src={{ gamestatic('wav/neg.wav') }} type='audio/wav'></audio></p>" +
    "<p>There are a total of "+all_trials.length+" trials to capture enough data for us to draw conclusions<br>At "+accY+" points for an accurate trial and "+accN+" for an error, there is a total of "+all_trials.length*accY+" points possible</p>" +
    "<p>The experiment begins beyond this final instruction screen, you will not be able to go backward from here</p>"
  ],
  on_finish: function() {
    if (SSI_ids[1] != 'test') { Cookies.set('ba', {"r": Cookies.getJSON('ba').r += 1}); }   // flag instruction completion; no penalty if they'd refreshed before now
  }
};
timeline.push(instructions_block);

if (SSI_ids[0].substr(0,4) == 'skip') { all_trials.length = 1; } // to skip to end after 1 trial set urlvar psid='skip<identifier>'
// build trial timeline
for(i = 0; i < all_trials.length; i += 1){
  // video trial to display stimuli
  timeline.push({
    type: 'video',
    autoplay: true,
    controls: false,
    timing_post_trial: 0,
    center_vertical: true,
    sources: all_trials[i].sources,
    data: all_trials[i].data
  });
  // button-response trial to collect responses
  timeline.push({
    type: 'single-stim',
    stimulus: function(){
      var first = jsPsych.data.get().last(1).values()[0][0].first;
      if(first == "Firefox") {
        return "{{ gamestatic('img/FirefoxFirst.png') }}";
      } else {
        return "{{ gamestatic('img/ChromeFirst.png') }}";
      }
    },
    is_html: false,
    choices: [70, 32, 74],  // f, spacebar, and j - https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    data: { correct_choice: all_trials[i].data[0].correctKey },
    on_finish: function(data) {
      // check accuracy
      jsPsych.data.addDataToLastTrial({ correct: data.key_press == data.correct_choice });
    }
  });
  // error tone feedback - sometimes the sound doesn't play and requires a keypress to advance; rebooting fixes it :(
  timeline.push({
    type: 'single-audio',
    stimulus: function(){
      var correct = jsPsych.data.get().last(1).values()[0].correct;
      if(correct){
        return "{{ gamestatic('wav/pos.wav') }}";
      } else {
        return "{{ gamestatic('wav/neg.wav') }}";
      }
    },
    is_html: false,
    trial_ends_after_audio: true
  });
  // feedback/score screen
  timeline.push({
    type: 'single-stim',
    stimulus: function(){
      var correct = jsPsych.data.get().last(2).values()[0].correct;
      if(correct){
        score += accY;
        jsPsych.data.addDataToLastTrial({ score: score });
        return "<p>Correct trial: Your score is now +"+accY+" = "+score+"</p>";
      } else {
        score += accN;
        jsPsych.data.addDataToLastTrial({ score: score });        
        return "<p>Incorrect trial: Your score is now "+accN+" = "+score+"</p>";
      }
    },
    is_html: true,
    timing_response: 2000,
    choices: 'none'
  });
}

// ask about browser preference (you can check this against user_agent as another datapoint)
var browserOptions = jsPsych.randomization.repeat(['Google Chrome', 'Mozilla Firefox', 'Microsoft Internet Explorer or Edge', 'Apple Safari', 'Opera'], 1);
browserOptions.push("Other");
var survey_block = {
  type: "survey-multi-choice",
  questions: ['What is your preferred web browser to use on a laptop or desktop computer?'],
  options: [browserOptions],
  required: [true]
};
timeline.push(survey_block);

// ask about demographics, but don't require (same as pilot)
var genderOptions = jsPsych.randomization.repeat(['Male', 'Female'], 1); genderOptions.push("Other");
var gender_block = {
  type: "survey-multi-choice",
  questions: ['What is your gender?'],
  options: [genderOptions]
};
timeline.push(gender_block);

var age_block = {
  timeline: [{
    type: "survey-text",
    questions: ['What is your age? (Please use whole numbers.)']
  }],
  loop_function: function(data){
    var input = JSON.parse(jsPsych.data.get().last(1).values()[0].responses).Q0;
    // accept only numbers or nothing (permit non-response but reject all non-empty strings)
    if(input == "") { return false;}
    if(isNaN(parseInt(input))) {
      return true;
    } else {
      return false;
  }
}
};
timeline.push(age_block);

var eduOptions = [
  'High school incomplete or less',
  'High school graduate or GED',
  "Some college (including tech/vocational, some community college, associate's degree)",
  "Four year college degree/bachelor's degree",
  'Some postgraduate or professional schooling, no postgraduate degree',
  "Postgraduate or professional degree, including master's, doctorate, medical or law"
];
var edu_block = {
  type: "survey-multi-choice",
  questions: ['What is the highest level of school you have completed or the highest degree you have received?'],
  options: [eduOptions]
};
timeline.push(edu_block);

var raceOptions = jsPsych.randomization.repeat([
  'White',
  'Asian or Asian-American',
  'Black or African-American',
  'Hispanic or Latin-American',
  'Native Hawaiian/Other Pacific Islander',
  'Native American/American Indian/Alaska Native'
], 1);  
var race_block = {
  type: "survey-multi-choice",
  questions: ['Which of the following describes your race?'],
  options: [raceOptions]
};
timeline.push(race_block);

// debrief at study conclusion
var debrief_block = {
  type: "text",
  text: function() {
    return "<h1>Debriefing:</h1>" + "<p>The videos were edited strategically from the <b>same source</b> to be slower or faster on different trials</p>" +
    "<p>We're interested in knowing whether the browser you <i>thought</i> was loading the page affected how fast it <i>seemed</i> to you</p>" +
    "<br>" +
    "<p>At "+accY+" points for an accurate trial and "+accN+" for an error, out of a total of "+all_trials.length+" trials you scored "+score+" points</p>"  +
    "<p>Please press any key to conclude - thank you for your participation!</p>";
  },
  timing_post_trial: 2000
};
timeline.push(debrief_block);

// add global properties
jsPsych.data.addProperties({
  psid: SSI_ids[0],
  pid: SSI_ids[1],
  ua: window.navigator.userAgent
  // I think the rest can be derived post-hoc in the process of more granular data munging?
});

// arrays of files to be called at .init for preloading (if specified via callback)
var images = ["{{ gamestatic('img/ChromeFirst.png') }}", "{{ gamestatic('img/FirefoxFirst.png') }}",  // answer screen images
              "{{ gamestatic('img/instAnswer.png') }}", "{{ gamestatic('img/keyhands.jpg') }}"];      // instruction screen images
var sounds = ["{{ gamestatic('wav/pos.wav') }}", "{{ gamestatic('wav/neg.wav') }}"];                  // trial accuracy feedback sounds

var csrf = "{% csrf_token %}";
jsPsych.init({
  timeline: timeline,
  fullscreen: true,
  show_progress_bar: true,
  preload_images: images,
  preload_audio: sounds,
  on_trial_start: function() {
    jsPsych.data.addDataToLastTrial({ trialStart: Date.now() });  // get timestamp
  },
  on_trial_finish: function() {
    jsPsych.data.addDataToLastTrial({ trialFinish: Date.now() }); // get timestamp
    // here check for events and kill the study if one occurred (ignore lead up to first trial)
    if (jsPsych.progress().current_trial_global > 0) {
      // check only entries for current trial
      var events = jsPsych.data.getInteractionData().values().filter(function(el){return el.trial === jsPsych.progress().current_trial_global;});
      // array should be empty if they were good, if not give them the boot
      if (events.length > 0) {
        var reason;
        switch (events[0].event) {
          case 'fullscreenexit':
            reason = "Exited full screen"; break;
          case 'tab_switch':
            reason = "Browser tab changed"; break;
          case 'blur':
          case 'focus':
            reason = "Application focus changed"; break;
          case 'key_zoom_increase':
          case 'key_zoom_decrease':
          case 'mouse_zoom_increase':
          case 'mouse_zoom_decrease':
            reason = "Zoom altered"; break;
        }
        kill(reason + ", will not continue study; disqualification.");
      }
    }
  },
  on_finish: function() {
    jsPsych.data.addProperties({ status: 'complete' });
    $.ajax({
      type: 'post',
      cache: false,
      dataType: 'text',
      url: 'datacollector/',
      contentType: 'application/json; charset=utf-8',
      headers: {
          'X-CSRFToken': '{{  csrf_token }}'
      },
      data: jsPsych.data.get().json(),
      error: function(output, textStatus) {
        console.log(textStatus);
      },
      success: function(output) {
        console.log(output);
        if (SSI_ids[1] != 'test') {
          window.location.replace("http://dkr1.ssisurveys.com/projects/end?rst=1&psid="+SSI_ids[0]+"&basic="+basicCode); // URL for SSI redirect
        } else {
          alert("completion redirect would be triggered now in non-test context")
        }
      }
    });
  },
});
