<?php
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json, true);

// get contents from questions file
$file_contents = file_get_contents('questions.json');

// decode json
$arr = json_decode($file_contents, true);

do {
    // generate random number to choose which question is sent back
    $rand = rand(0, sizeof($arr) - 1);

    // do it as long question that client has not gotten yet is chosen
} while (in_array($rand, $data));

// get random question from array
$question = $arr[$rand];

// store question type, time for question, question, possible answers and question ID
$returned_value = [$question['typ'], $question['zeitraum'], $question['frage'], $question['antwort'], $rand];

// encode return value to json
$returned_value_json = json_encode($returned_value);

// return value to script
echo $returned_value_json;






