const toHHMMSS = (time) =>
{
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

log =
{    
    info: (message) => console.log("\x1b[0m", `[${toHHMMSS(new Date())}] ${message}`),
    error: (error) => console.error("\x1b[31m", `[${toHHMMSS(new Date())}] ${error}`)
}

truncate = (str, words) => str.split(" ").splice(0, words).join(" ");