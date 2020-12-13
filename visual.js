body = document.getElementById("body")

main_menu_header = document.getElementById("main_menu_header")

button_input_username = document.createElement("button")
button_input_username.innerHTML = "START GAME"
button_input_username.addEventListener("click", load_game_username_input_site)


button_highscore = document.createElement("button")
button_highscore.innerHTML = "HIGHSCORES"
button_highscore.addEventListener("click", load_highscore_site)

button_explanation = document.createElement("button")
button_explanation.innerHTML = "HOW IT WORKS"

button_back_to_main_menu = document.createElement("button")
button_back_to_main_menu.innerHTML = "BACK TO MAIN MENU"
button_back_to_main_menu.addEventListener("click", load_main_menu_site)

button_start_game = document.createElement("button")
button_start_game.innerHTML = "LET'S GO"
button_start_game.addEventListener("click", load_game_site)

input_field_username = document.createElement("input")

main_game_header = document.createElement("h1")
main_game_header.className = "main_headers"

choice_list = document.createElement("ol")
choice_list.className = "choice_list"

button_send_answer = document.createElement("button")
button_send_answer.innerHTML = "SEND"
button_send_answer.className = "send_answer"

input_field_result = document.createElement("input")


body.appendChild(button_input_username)
body.appendChild(button_highscore)
body.appendChild(button_explanation)


let storage = []
let selected = []
let username = ""
let timeout
let clock
let question_counter = 1
let points = 0

function load_highscore_site() {
    body.innerHTML = "";

    let highscore_header = document.createElement("h1")
    highscore_header.innerHTML = "HALL OF FAME"
    highscore_header.className = "main_headers"
    body.appendChild(highscore_header)

    let highscore_scroller = document.createElement("div")
    let highscore_list = document.createElement("ol")
    highscore_scroller.className = "highscore_div"

    highscore_scroller.appendChild(highscore_list)

    body.appendChild(highscore_scroller)

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function c() {
        if (this.readyState === 4 && this.status === 200) {
            let storage_object = JSON.parse(this.responseText)
            let storage_array = Object.entries(storage_object)
            storage_array.sort(function (item1, item2) {
                return item2[1] - item1[1]
            })
            for (const key in storage_array) {
                let item = document.createElement("li")
                item.className = "listitem"
                item.innerHTML = storage_array[key].toString()
                highscore_list.appendChild(item)
            }
            body.appendChild(button_back_to_main_menu);
        }
    }
    xhttp.open("POST", "highscore.json", true)
    xhttp.send()
}

function load_main_menu_site() {
    body.innerHTML = "";

    body.appendChild(main_menu_header);
    body.appendChild(button_input_username)
    body.appendChild(button_highscore)
    body.appendChild(button_explanation)

    question_counter = 1
}

function load_game_username_input_site() {
    body.innerHTML = ""

    let input_username_header = document.createElement("h1")
    input_username_header.className = "main_headers"

    input_username_header.innerHTML = "Input username!"

    body.appendChild(input_username_header)
    body.appendChild(input_field_username)
    body.appendChild(button_start_game)
    body.appendChild(button_back_to_main_menu)
}

function load_ending_screen() {
    console.log("end")
    input_field_username.value = ""

    body.innerHTML = ""
    body.appendChild(main_game_header)

    main_game_header.innerHTML = "You have scored " + points + "/10 points"

    points = 0
    body.appendChild(button_back_to_main_menu)
}

function load_game_site() {
    if (input_field_username.value === "") {
        alert("Input username!")
    } else {
        console.log(question_counter)
        if (question_counter > 10) {
            load_ending_screen()
        } else {
            body.innerHTML = ""
            body.appendChild(main_game_header)
            let timer_show = document.createElement("p")
            let question_counter_show = document.createElement("p")
            question_counter_show.innerHTML = question_counter + "/10"

            body.appendChild(timer_show)
            body.appendChild(question_counter_show)

            username = input_field_username.value
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function c() {
                let item;
                if (this.readyState === 4 && this.status === 200) {
                    storage = JSON.parse(this.responseText)

                    timeout = window.setTimeout(function () {
                        button_send_answer.removeEventListener("click", handler_send_answer);
                        choice_list.innerHTML = ""
                        input_field_result.value = ""
                        load_game_site()
                    }, storage[1] * 1000)

                    let current_timer = storage[1]
                    timer_show.innerHTML = current_timer

                    clock = window.setInterval(function () {
                        current_timer--
                        timer_show.innerHTML = current_timer
                    }, 1000)

                    main_game_header.innerHTML = storage[2]
                    selected = []
                    if (storage[0] === "MULTI" || storage[0] === "SINGLE") {
                        body.appendChild(choice_list)
                        for (let possible in storage[3]) {
                            item = document.createElement("li")
                            item.innerHTML = storage[3][possible]
                            choice_list.appendChild(item)
                            item.addEventListener("click", function () {
                                if (storage[0] === "SINGLE") {
                                    if (selected[0] === this.innerText) {
                                        selected.splice(0, 1)
                                        this.classList.remove("selected")
                                    } else {
                                        if (selected[0] !== undefined) {
                                            document.getElementById(selected[0]).classList.remove("selected")
                                        }
                                        selected = []
                                        selected.push(this.innerText)
                                        this.className = "selected"
                                        this.id = this.innerText
                                    }
                                } else {
                                    for (item in selected) {
                                        if (selected[item] === this.innerText) {
                                            selected.splice(item, 1);
                                            this.classList.remove("selected")
                                            return
                                        }
                                    }
                                    selected.push(this.innerText);
                                    this.className = "selected"
                                }
                            }, this)
                        }
                    } else {
                        body.appendChild(input_field_result)
                    }
                    body.appendChild(button_send_answer)

                    button_send_answer.addEventListener("click", handler_send_answer)
                }
            }
            xhttp.open("POST", "getQuestions.php", true)
            xhttp.send()
        }
    }
}

function handler_send_answer() {
    window.clearTimeout(timeout)
    if (storage[0] === "OPEN") {
        selected.push(input_field_result.value)
    }
    let xhttpResult = new XMLHttpRequest();
    xhttpResult.onreadystatechange = function c() {
        if (xhttpResult.readyState === 4 && xhttpResult.status === 200) {
            if (xhttpResult.responseText.includes("true")) {
                alert("Correct!")
            } else {
                alert("False!")
            }
            if (xhttpResult.responseText.includes("true")) {
                points++
            }
            choice_list.innerHTML = "";
            button_send_answer.removeEventListener("click", handler_send_answer);
            input_field_result.value = ""
            question_counter++
            load_game_site()
        }
    }
    let object = {
        "username": username,
        "answer": selected,
        "id": storage[4]
    }
    xhttpResult.open("POST", "evaluateAnswer.php", true)
    xhttpResult.setRequestHeader("Content-Type", "application/json")
    xhttpResult.send(JSON.stringify(object))
}

// TODO: Don't get same question twice
// TODO: Make pretty
// TODO: Game explanation
