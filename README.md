# Meter Delta

A tool to help musicians with dynamic time signature improvisation, or
changing meters in American (which is the inspiration for the name).

## Using Meter Delta

Meter Delta is a JavaScript library you can use to handle dynamic time
signatures that takes care of the counting and timings for you. You
can interact with Meter Delta using its callbacks within your own UI,
or use the simple UI that is provided.

### Examples

Here are some usage examples of using the library. Full documentation
is provided below.

For examples on how to use the provided UI, see the documentation in
the UI directory.

#### Very simple usage

    var md = new MeterDelta();
	md.start();
	// ... wait a bit
	md.stop();

This isn't very useful because without adding callbacks you'll just be
warming your computer up.

#### Practical usage

    var md = new MeterDelta({
		tempo: 60,
		onBeat: function(barBeatCount, innacuracy){ console.log("beat", barBeatCount, innacuracy) },
		onBar: function(current, next){ console.log("bar", current, next) },
		onStop: function(){ console.warn("stop") },
		onStart: function(){ console.info("start") }
	});
	md.start();
	// ... watch the pretty log messages for a bit
	md.stop();

This creates a MeterDelta with the default time signatures and a
(slow) tempo of 60bpm to help us see what's happening. We've attached
some callbacks that provide a simple UI using the console.

### Creating an instance of Meter Delta

First, include the Meter Delta script on your page. You can then
create an instance of Meter Delta:

    var md = new MeterDelta( options );

MeterDelta takes an options object that will configure the ensuing
improvisation. The following options are available:

#### tempo

    default: 120

This is the tempo in bpm that the clock should run at. Note that this
is the number of crotchets (quarter notes) per minute by convention,
whatever time signature is currently being run.

#### variance

    default: 25

This should be a number between 0 and 100 to describe how dynamic the
time signatures should be (how often the meter should change). A value
of 100 means that the time signature should change on every bar, while
a value of 0 means the time signature should never change. The default
value of 25 means there should be a new time signature roughly a
quarter of the time.

Note that even if the variance triggers a time signature change, since
they are chosen randomly it is possible the same one may be chosen
again.

#### sigs

    default:[
        [ [4, 4], [3, 4], [6, 4], [6, 8], [12, 8] ],
        [ [5, 4], [7, 4], [7, 8], [9, 8] ],
        [ [3, 8], [5, 8], [11, 8], [13, 8] ],
        [ [3, 16], [5, 16], [7, 16], [9, 16], [11, 16], [13, 16], [15, 16] ]
    ]

This allows you to customise which time signatures (meters) should
appear. It should be a nested array of time signatures with each time
signature being an array of two elements. The first element is the
number of beats and the second the beat length, just like you'd see on
a music score.

Time signatures are provided at multiple levels to allow the
complexity to be tweaked (see below).

#### complexity

    default: 2

This value is the number of time signature groups that should be
considered eligible for inclusion. The default value 2 would allow the
first two sets from the provided (or default) time signatures. If you
provide your own sigantures then this is up to you, but with the
default ones this represents the "difficulty" of the time signatures
that will appear.

#### onBeat

    callback: onBeat(barBeatCount, inaccuracy)

This callback is fired on every semiquaver beat (sixteenth note). The
callback is passed two variables. Firstly, the current
"barBeatCount". This value is the number of semiquavers we've seen so
far in this bar. The second argument is the inaccuracy, which is a
measure of how late / early the beat was triggered.

Due to JavaScript's poor timing beats are likely to be fired up to
10ms out of their correct time. Meter Delta will compensate for this
and always attempt to trigger beats at exactly the correct time but
this number will tell you how accurate the JavaScript really
was. Basically, it will keep in time very well but if you need it to
sync with something external it may be useful to know if a beat is a
few ms out.

#### onBar

    callback: onBar(current, next)

This callback is fired every time the bar changes. It is passed the
new current and next time signatures (meters). It is likely that the
UI will want to display one or both of these to the musicians (if
humans are involved).

#### onStart

    callback: onStart()

This callback is fired when the instance is started.

#### onStop

    callback: onStop()

This callback is fired when the instance is stopped.

### Using Meter Delta

Your MeterDelta instance has the following methods:

#### start

This method will kick off the dynamic time signatures.

    md.start();

#### stop

    md.stop();

The stop method will kill the current timer and stop the time
signature improvisation from running.

#### isRunning

If you want to know whether the instance is currently running then use
this method. It returns a boolean.

    md.isRunning();

#### getStartTime

This method will retrieve the time that the instance was started. This
may be useful for e.g. progress bars. The time is returned as an int
based on your browser's clock's millisecond count.

    md.getStartTime();

## Notes

This is a JavaScript library and JavaScript is a bit silly
sometimes. In particular, it is single threaded. To get the best
accuracy out of Meter Delta:

* avoid using other timers on the page
* try to limit the amount of processing done on each callback
* really try to limit what you do in the onBeat callback

The more stuff that's happening on the page the less reliable the
browser's timing will become. Meter Delta targets the next beat using
the actual millisecond date that it is expected, rather than by using
e.g. setInterval. This means it *will* keep in time. However, if the
page is very busy then individual beats may fall at the wrong time.

## Licence

This project is offered under the GPLv3 licence because I'm
increasingly of the opinion that [RMS](http://stallman.org/) has been
right all along and we have been fools.
