$(() => {
    // constructor to create newUser object from user's survey answers
    function User(name, scores) {
        this.name = name;
        this.scores = scores;
    }
    // submit survey
    $('form').submit(function () {
        event.preventDefault();
        let answers = $('input:checked'); // array of user-selected answers
        let name = $('input:first-of-type').val(); // user-entered name
        let scores = []; // to hold values of user's answers

        // loop through user's answers and push values to scores array
        for (let i = 0; i < answers.length; i++) {
            let thisAnswer = $(answers[i]).val();
            scores.push(Number(thisAnswer));
        }
        let newUser = new User(name, scores); // create newUser from user's survey responses

        // post results and display on page
        $.post('/results', newUser , (res) => {
            // remove everything on the page except for the results display div
            $('body').children('form, div').not('.resultsDisplay').remove(); 
            // display thank you message
            $('.resultsDisplay').prepend(`Thank you ${newUser.name}!` + '<br>' + `Based on your survey answers, your best match is:`); 
            $('.friendName').append(res.name); // display name of user's best match
            $('.friendImg').attr('src', res.photo); // display photo of user's best match
        }); // end post results
    }); // end submit survey
}); // end ready