function MeterDeltaUI(container, beatEl, $) {
    "use strict";

    if (!container) {
        throw new Error("Missing required parameter, container");
    }
    $ = $ || jQuery;
    beatEl = beatEl ? $(beatEl)[0] : false;

    var instanceOptions = {
            onBeat: onBeat,
            onBar: onBar,
            onStop: onStop,
            onStart: onStart
        },
        meterDelta,
        // control elements
        tempoControl, tempoLabel, varianceControl, varianceLabel, complexityControl, complexityLabel,
        startButton, stopButton,
        // containers
        controlsForm, controlsContainer, displayContainer, currentContainer, nextContainer,
        // other display
        beatIndicator;

    function init() {
        buildUI();
    }
    function buildUI() {
        tempoControl = $("<input id='meter-delta-tempo-id' name='meter-delta-tempo-tempo' type='number' min='1' max='400' value='120'>");
        tempoLabel = $("<label for='meter-delta-tempo-id'>bpm</label>");
        varianceControl = $("<input id='meter-delta-variance-id' name='meter-delta-variance-tempo' type='number' min='0' max='100' value='25'>");
        varianceLabel = $("<label for='meter-delta-variance-id'>variance</label>");
        complexityControl = $("<input id='meter-delta-complexity-id' name='meter-delta-variance-tempo' type='number' min='1' max='4' value='2'>");
        complexityLabel = $("<label for='meter-delta-complexity-id'>complexity</label>");
        startButton = $("<button class='meter-delta-start'>Start</button>").click(function(e) {e.preventDefault(); start(); });
        stopButton = $("<button class='meter-delta-stop'>Stop</button>").hide().click(function(e) {e.preventDefault(); stop(); });
        controlsForm = $("<form class='meter-delta-controls'/>");
        controlsContainer = $("<div class='controls'></div>");
        displayContainer = $("<div class='meter-delta-display'></div>");
        currentContainer = $("<div class='current'><span class='note-count'></span><span class='note-value'></span></div>");
        nextContainer = $("<div class='next'><span class='note-count'></span><span class='note-value'></span></div>");
        beatIndicator = $("<div class='beat-indicator'></div>").hide();

        controlsForm.append(tempoControl, tempoLabel, varianceControl, varianceLabel, complexityControl, complexityLabel);
        controlsContainer.append(controlsForm, startButton, stopButton);
        displayContainer.append(beatIndicator, currentContainer, nextContainer);
        container.append(controlsContainer, displayContainer);
        return container;
    }
    function getOptions() {
        var options = {};
        for (var optionName in instanceOptions) {
            if (instanceOptions.hasOwnProperty(optionName)) {
                options[optionName] = instanceOptions[optionName];
            }
        }
        options.tempo = tempoControl.val();
        options.variance = varianceControl.val();
        options.complexity = complexityControl.val();
        return options;
    }
    function start() {
        stop();
        meterDelta = new MeterDelta(getOptions());
        meterDelta.start();
    }
    function stop() {
        if(meterDelta && meterDelta.isRunning()) {
            meterDelta.stop();
        }
    }
    function giveFeedback() {
        if (beatEl) {
            beatEl.currentTime = 0;
            beatEl.play();
        }
        beatIndicator.show().hide(100);
    }
    function onBeat(beatCount, current) {
        switch(current[1]) {
            case 4:
                if (1 === beatCount % 4) {
                    giveFeedback();
                }
                break;
            case 8:
                if (1 === beatCount % 2) {
                    giveFeedback();
                }
                break;
            default:
                if (1 === beatCount) {
                    giveFeedback();
                }
        }
    }
    function onBar(current, next) {
        currentContainer.find('.note-count').text(current[0]);
        currentContainer.find('.note-value').text(current[1]);
        nextContainer.find('.note-count').text(next[0]);
        nextContainer.find('.note-value').text(next[1]);
        nextContainer.hide().fadeIn(150);
    }
    function onStop() {
        controlsForm.show();
        startButton.show();
        stopButton.hide();
        currentContainer.hide().find('span').empty();
        nextContainer.hide().find('span').empty();
    }
    function onStart() {
        controlsForm.hide();
        startButton.hide();
        stopButton.show();
        currentContainer.show();
        nextContainer.show();
    }

    return {
        init: init,
        start: start,
        stop: stop,
        instance: meterDelta
    };
}