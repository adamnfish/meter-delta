# Meter Delta's UI

This is a work in progress.

Meter Delta provides a very simple UI. I'll flesh out these
instructions as I work on the UI integration with my own site.

## Example

Include the required files and then create an instance of the UI,
passing in the container element to use.

    <div class="meter-delta"></div>
    
    <link rel="stylesheet" href='/path/to/meter-delta-ui.css")' />
    <script src='/path/to/meter-delta.js'></script>
    <script src='/path/to/meter-delta-ui.js'></script>
    <script>
        var mdui = new MeterDeltaUI(jQuery(".meter-delta"));
        mdui.init();
    </script>

You may also provide an HTML5 audio tag that the UI can use as a
metronome.


    <div class="meter-delta">
        <audio class='beat' preload>
            <source src='/path/to/meter-delta-beat.ogg'/>
            <source src='/path/to/meter-delta-beat.mp3'/>
        </audio>
    </div>
	
    <link rel="stylesheet" href='/path/to/meter-delta-ui.css")' />
    <script src='/path/to/meter-delta.js'></script>
    <script src='/path/to/meter-delta-ui.js'></script>
    <script>
        var mdui = new MeterDeltaUI(jQuery(".meter-delta"), jQuery('.meter-delta .beat'));
        mdui.init();
    </script>
