function get_date()
{
    const currentDate = new Date();

    // Get individual date and time components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1 and pad with 0 if needed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // Create a formatted date and time string
    const formattedDateTime = `${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

function getTimeDifference(startDate, endDate) {
    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
  
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    // Format the result as hh:mm:ss
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
    return formattedTime;
  }

function getRandomTimeout() {
    const randomTimeout = Math.floor(Math.random() * (16000 - 5000 + 1)) + 5000;
    console.log("   [?] Timeout of: " + randomTimeout + " ms");
    return randomTimeout;
}
module.exports = {get_date, getTimeDifference, getRandomTimeout};