<?php
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json, true);


if (isset($data['username']) && isset($data['answer']) && isset($data['id'])) {

    // store username
    $username = $data['username'];

    // store answer the user gave
    $user_answer = $data['answer'];

    // store question id
    $question_id = $data['id'];

    // get contents from questions file
    $file_contents = file_get_contents('questions.json');

    // decode json
    $arr = json_decode($file_contents, true);

    // get question which user answered
    $question = $arr[$question_id];

    if ($question['typ'] == "SINGLE") {
        // check if user has answered correctly
        if ($question['antwort'][$question['richtige'][0]] == $user_answer[0]) {
            // call corresponding function
            is_correct($username);
        } else {
            // return false to script if answer is incorrect
            echo "false";
        }
    } elseif ($question['typ'] == "OPEN") {
        // check if user has answered correctly
        if ($question['richtige'] == $user_answer[0]) {
            // call corresponding function
            is_correct($username);
        } else {
            // return false to script if answer is incorrect
            echo "false";
        }
    } elseif ($question['typ'] == "MULTI") {
        $temp = array();
        foreach ($question['richtige'] as $key => $value) {
            $temp[$key] = $question['antwort'][$value];
        }
        if (count(array_intersect($temp, $user_answer)) == count($temp) && count($user_answer) != 0) {
            is_correct($username);
        } else {
            echo "false";
        }
    }
}
function is_correct($username)
{
    // return true to script if answer is correct
    echo "true";

    // get contents from highscore file
    $file_contents_highscore = file_get_contents('highscore.json');

    // decode json
    $arr_highscore = json_decode($file_contents_highscore, true);

    // increase points of user by 1
    $arr_highscore[$username]++;

    // encode array to json
    $arr_highscore_write = json_encode($arr_highscore);

    // write updated highscore contents to highscore file
    file_put_contents('highscore.json', $arr_highscore_write);
}
