function MeterDelta(userOptions) {
    "use strict";

    var options = {
            tempo: 120, // bpm
            variance: 25, // 0 - 100, how dynamic should the sigs be
            complexity: 2, // how many sets of sigs to include
            sigs: [
                [ [4, 4], [3, 4], [6, 4], [6, 8], [12, 8] ],
                [ [5, 4], [7, 4], [7, 8], [9, 8] ],
                [ [3, 8], [5, 8], [11, 8], [13, 8] ],
                [ [3, 16], [5, 16], [7, 16], [9, 16], [11, 16], [13, 16], [15, 16] ]
            ],
            onBeat: function(barBeatCount, inaccuracy) {},
            onBar: function(current, next) {},
            onStop: function() {},
            onStart: function() {}
        },
        eligibleSigs = [],
        timer = false,
        startTime = 0,
        beatCount = 0,
        barBeatCount = 0,
        targetBarBeatCount = 0,
        beatMs,
        current,
        next;

    // setup options
    for (var optionName in userOptions) {
        if (userOptions.hasOwnProperty(optionName)) {
            options[optionName] = userOptions[optionName];
        }
    }
    beatMs = (60 * 1000) / (options.tempo * 4);
    for (var i = 0; i < options.complexity; i++) {
        eligibleSigs = eligibleSigs.concat(options.sigs[i]);
    }

    function tick() {
        if (barBeatCount === targetBarBeatCount) {
            nextBar();
        }
        barBeatCount++;
        beatCount++;
        var msToNextBeat = Math.floor(startTime + (beatCount * beatMs) - (+new Date));
        timer = setTimeout(function(){ tick(); }, msToNextBeat);
        options.onBeat(barBeatCount, msToNextBeat - beatMs);
    }
    function pickNewSig() {
        if (!current || (Math.floor(Math.random() * 100) <= options.variance)) {
            return eligibleSigs[Math.floor(Math.random() * eligibleSigs.length)];
        } else {
            return current;
        }
    }
    function nextBar() {
        current = next;
        next = pickNewSig();
        targetBarBeatCount = current[0] * (16 / current[1]);
        barBeatCount = 0;
        options.onBar(current, next);
    }
    function start() {
        if (isRunning()) {
            throw new Error("This instance is already running");
        } else {
            options.onStart();
            startTime = +new Date;
            beatCount = 0;
            barBeatCount = 0;
            next = pickNewSig();
            nextBar();
            tick();
        }
    }
    function stop() {
        clearTimeout(timer);
        timer = false;
        current = false;
        next = false;
        options.onStop();
    }
    function isRunning() {
        return !!timer;
    }

    return {
        start: start,
        stop: stop,
        isRunning: isRunning,
        getStartTime: function() { return startTime; }
    };
}
