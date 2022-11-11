

function newDate(){

    let today = new Date()
    let option = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        
    }

    let day = today.toLocaleDateString("en-us", option)
    return day;
}
module.exports.newDate=newDate;

function newDay(){

    let today = new Date()
    let option = {
        weekday: 'long',
        day: 'numeric',
        
    }

    let day = today.toLocaleDateString("en-us", option)
    return day;
}
module.exports.newDay=newDay;
