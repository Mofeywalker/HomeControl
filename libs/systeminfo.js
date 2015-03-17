var exports = module.exports = {};

exports.getSystemInfo = function() {
    var os = require('os');

    var sysinfos;

    //Returns hostname
    sysinfos.hostname = os.hostname();
    //Returns the operating system name.
    sysinfos.ostype = os.type();
    //Returns the operating system platform.
    sysinfos.osplat = os.platform();
    //Returns the operating system CPU architecture. Possible values are "x64", "arm" and "ia32".
    sysinfos.arch = os.arch();
    //Returns the operating system release.
    sysinfos.release = os.release();
    //Returns the system uptime in seconds
    sysinfos.uptime = os.uptime();
    //Returns an array containing the 1, 5, and 15 minute load averages.
    sysinfos.loadavg = os.loadavg();
    //Returns the total amount of system memory in bytes.
    sysinfos.totalmem = os.totalmem();
    //Returns the amount of free system memory in bytes.
    sysinfos.freemem = os.freemem();

    return sysinfos;
}