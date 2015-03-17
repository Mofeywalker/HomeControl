var exports = module.exports = {};

/**
 * Funktion zum zurueckliefern der Systeminformationen. Wird benoetigt um im Webinterface die
 * Systeminfos auszugeben und um app.js etwas schlanker zu halten.
 * @returns {exports}
 */
exports.getSystemInfo = function() {
    var os = require('os');

    //Returns hostname
    this.hostname = os.hostname();
    //Returns the operating system name.
    this.ostype = os.type();
    //Returns the operating system platform.
    this.osplat = os.platform();
    //Returns the operating system CPU architecture. Possible values are "x64", "arm" and "ia32".
    this.arch = os.arch();
    //Returns the operating system release.
    this.release = os.release();
    //Returns the system uptime in seconds
    this.uptime = os.uptime();
    //Returns an array containing the 1, 5, and 15 minute load averages.
    this.loadavg = os.loadavg();
    //Returns the total amount of system memory in bytes.
    this.totalmem = os.totalmem();
    //Returns the amount of free system memory in bytes.
    this.freemem = os.freemem();

    return this;
}