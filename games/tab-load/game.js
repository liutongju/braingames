'use strict';

var video_options = [{version: 2, video_url: "{{ gamestatic('vid/Animation_User_Test_Prototype.mp4') }}"},
                     {version: 3, video_url: "{{ gamestatic('vid/Animation_User_Test_Prototype.mp4') }}"}]

var index = Math.floor(Math.random() * video_options.length);

// question asked at the end of both trials comparing the two
var likable_question = {
  type: 'survey-multi-choice',
  questions: ['which animation did you prefer?'],
  options: [['the first', 'the second']],
  required: [true],
  horizontal: true
};

var speed_question = {
  type: 'survey-multi-choice',
  questions: ['That was fast.'],
  options: [['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']],
  required: [true],
  horizontal: true
};

var survey_trial = {
  type: 'survey-text',
  questions: [`<p>Thank you for participating!</p><p>Please enter your usertesting.com username</p>`],
  rows: [1],
  columns: [50]
};

var video_options = [
  // one control version
  {data: {version: 1, video_url: "{{ gamestatic('vid/Animation_User_Test_Prototype.mp4') }}"}, timeline: [{}, speed_question] },
  // one of either test version
  {data: video_options[index], timeline: [{}, speed_question] },
];

var test_block = {
  timeline: video_options,
  type: 'html',
  url: "{{ gamestatic('html/startup.html') }}",
  cont_btn: 'end-trial',
  randomize_order: true,
};

var timeline = [];
timeline.push(survey_trial);
timeline.push(test_block);
timeline.push(likable_question);

var csrf = "{% csrf_token %}";

/* start the experiment */
jsPsych.init({
  timeline: timeline,
  on_finish: function() {
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