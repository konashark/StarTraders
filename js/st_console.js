var CONSOLE = {};

(function() {

    this.active = true;

    //*******************************************
    this.create = function () {
        console.log("Creating...");

        $('#screen').append(
            '<div id="consoleContainer">' +
            '   <div id="console">' +
            '       <div id="conEnergyLabel">ENERGY</div>' +
            '       <div id="conEnergyGauge">' +
            '           <div id="conEnergyBar"></div>' +
            '       </div>' +
            '       <div id="conGaugePanel">' +
            '           <div id="conShieldButton" class="conButton">SHLDS</div>' +
            '           <div id="conShieldIndicator" class="conIndicator"></div>' +
            '           <div id="conShieldGauge" class="conGauge">' +
            '               <div id="conShieldBar" class="conGaugeBar"></div>' +
            '           </div>' +
            '           <div id="conPulseButton" class="conButton">PULSE</div>' +
            '           <div id="conPulseIndicator" class="conIndicator"></div>' +
            '           <div id="conPulseGauge" class="conGauge">' +
            '               <div id="conPulseBar" class="conGaugeBar"></div>' +
            '           </div>' +
            '           <div id="conTorpedoButton" class="conButton">TORPS</div>' +
            '           <div id="conTorpedoIndicator" class="conIndicator"></div>' +
            '           <div id="conTorpedoGauge" class="conGauge">' +
            '               <div id="conTorpedoBar" class="conGaugeBar"></div>' +
            '           </div>' +
            '       </div>' +
            '       <div id="conNavContainer">' +
            '           <div id="conNavLabel">NAV</div>' +
            '           <img id="conLeft" class="conNavButton" src="./images/left.png">' +
            '           <div id="conStop"></div>' +
            '           <img id="conRight" class="conNavButton" src="./images/right.png">' +
            '           <img id="conForward" class="conNavButton2" src="./images/up.png">' +
            '           <img id="conReverse" class="conNavButton2" src="./images/down.png">' +
            '       </div>' +
            '       <div id="conCommContainer">' +
            '       </div>' +
            '       <div id="conCommLabel">COM</div>' +
            '       <div id="conCommHailButton" class="conButton">HAIL</div>' +
            '       <div id="conCommAckButton" class="conButton">ACK</div>' +
            '   </div>' +
            '</div>'
        );

        SCANNERS.createShortRangeScanner();

        $('#consoleContainer').on('click', '#conLeft', onLeft);
        $('#consoleContainer').on('click', '#conRight', onRight);

        this.active = true;

        return {
        };
    };

    //*******************************************
    this.update = function () {
        if (SCANNERS.srsActive) { SCANNERS.updateShortRangeScanner(); }
    };

    //*******************************************
    this.hide = function () {
        this.active = false;
        $('#').css('display', 'none');
    };

    //*******************************************
    this.show = function () {
        this.active = true;
        $('#').css('display', 'block');
    };

    //*******************************************
    var onLeft = function (event) {
    };

    //*******************************************
    var onRight = function (event) {
    };
}).apply(CONSOLE);
