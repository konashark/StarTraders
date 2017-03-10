var  = {};

(function() {

    this.active = false;
    this.ctx = undefined;

    //*******************************************
    this.create = function () {
        console.log("Creating...");

        $('#screen').append(
            '<div id="" style="display: none">
            '</div>'
        )

        return {
        };
    };

    //*******************************************
    this.update = function () {
        var ctx = this.ctx;
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, 480, 320);

        return computer;
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

}).apply();
