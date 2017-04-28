'use strict';

var new_tab_video_options = [{treatment_type: "new tab", version: 1, video_url: "https://mozilla.github.io/braingames/videos/new-tab/new_tab_1.mp4"},
                             {treatment_type: "new tab", version: 2, video_url: "https://mozilla.github.io/braingames/videos/new-tab/new_tab_2.mp4"},];

var loading_video_options = [{treatment_type: "page load", version: 1, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_1.mp4"},
                             {treatment_type: "page load", version: 2, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_2.mp4"},
                             {treatment_type: "page load", version: 3, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_3.mp4"},
                             {treatment_type: "page load", version: 4, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_4.mp4"},];

var index = Math.floor(Math.random() * loading_video_options.length);
// var index2 = Math.floor(Math.random() * loading_video_options.length);
var index2 = Math.floor(Math.random() * loading_video_options.length - 1);
if (index2 >= index) {
  index2 = index2 + 1;
}
var counter = 0;

let increment = function() {
  counter++;
}

var new_tab_questions = {
  type: 'survey-multi-choice',
  questions: ['The wait for the tab to load was: ', 'The opening of the new tab was: ', 'The opening of the new tab was: '],
  options: [['1- Extremely slow', '2- Slow', '3- Somewhat slow', '4- Neither slow nor fast', '5- Somewhat fast', '6- Fast', '7- Extremely fast'],
            ['1- Extremely unresponsive', '2- Unresponsive', '3- Somewhat Unresponsive', '4- Neither unresponsive nor responsive', '5- Somewhat responsive', '6- Responsive', '7- Extremely responsive'],
            ['1- Extremely unimaginative', '2- Unimaginative', '3- Somewhat unimaginative', '4- Neither unimaginative nor innovative', '5- Somewhat innovative', '6- Innovative', '7- Extremely innovative']],
  required: [true, true, true],
  horizontal: true
};

var page_loading_questions = {
  type: 'survey-multi-choice',
  questions: ['The wait for the page to load was: ', 'The loading of the page was: ', 'The loading of the page was: '],
  options: [['1- Extremely slow', '2- Slow', '3- Somewhat slow', '4- Neither slow nor fast', '5- Somewhat fast', '6- Fast', '7- Extremely fast'],
            ['1- Extremely unresponsive', '2- Unresponsive', '3- Somewhat Unresponsive', '4- Neither unresponsive nor responsive', '5- Somewhat responsive', '6- Responsive', '7- Extremely responsive'],
            ['1- Extremely cumbersome', '2- Cumbersome', '3- Somewhat cumbersome', '4- Neither cumbersome nor straight-forward', '5- Somewhat straight-forward', '6- Straight-forward', '7- Extremely straight-forward']],
  required: [true, true, true],
  horizontal: true
};

var username = {
  type: 'survey-text',
  questions: [`<p>Please enter your usertesting.com username.</p><p> We are only collecting this information to know that you have completed the study here.</p>`],
};

var loading_games = {
  randomize_order: true,
  timeline: [
    // one control version
    {data: {treatment_type: "page load", version: 5, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_5_current.mp4"}, timeline: [{}, page_loading_questions] },
    // two of the test versions
    {data: loading_video_options[index], timeline: [{}, page_loading_questions] },
    {data: loading_video_options[index2], timeline: [{}, page_loading_questions] },
  ]
};

var new_tab_games = {
  randomize_order: true,
  timeline: [
    // one control version
    {data: {treatment_type: "new tab", version: 3, video_url: "https://mozilla.github.io/braingames/videos/new-tab/new_tab_3_current.mp4"}, timeline: [{}, new_tab_questions] },
    // the two test versions
    {data: new_tab_video_options[0], timeline: [{}, new_tab_questions] },
    {data: new_tab_video_options[1], timeline: [{}, new_tab_questions] },
  ]
};

var test_block = {
  timeline: [new_tab_games, loading_games],
  type: 'html',
  url: "{{ gamestatic('html/startup.html') }}",
  cont_btn: 'end-trial',
  randomize_order: true,
};

var timeline = [];
timeline.push(test_block);
timeline.push(username);

var csrf = "{% csrf_token %}";
var end_message = `<div id="thank-you">Thanks for completing the survey! <br> Please advance to the next task on the usertesting.com interface.<div>`;

/* start the experiment */
jsPsych.init({
  timeline: timeline,
  on_trial_start: function(){
    increment();
  },
  on_finish: function() {
    jsPsych.endExperiment(end_message);
    $.ajax({
      type: 'post',
      cache: false,
      url: 'datacollector/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
          'X-CSRFToken': '{{ csrf }}'
      },
      data: jsPsych.data.dataAsJSON(),
      success: function(output) { console.log(output); }
    });
  }
});