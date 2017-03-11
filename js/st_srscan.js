var SCANNERS = {};

(function() {

    this.srsActive = true;
    this.lrsActive = false;

    var srsCtx, gridImg, planetImg, enemyImg, starbaseImg, srsCanvas;
    var lrsCtx, shipImg, lrsCanvas;

//*********************************************************
    this.createShortRangeScanner = function()
    {
        console.log("Creating Short Range Scanner...");
        var srsCanvas = document.createElement('canvas');
        srsCanvas.id = "srs";
        srsCanvas.width = 180;
        srsCanvas.height = 180;
        srsCtx = srsCanvas.getContext('2d');
        srsCtx.font = "12px arial";

        $('#console').append('<div id="srsContainer"><span id="srsLabel">SHORT RANGE SCANNER</span></div>');
        $('#srsContainer').append(srsCanvas);

        // Load Scanner Icons
        planetImg = new Image();
        planetImg.src = "./images/srs_planet.png";

        enemyImg = new Image();
        enemyImg.src = "./images/srs_enemy.png";

        starbaseImg = new Image();
        starbaseImg.src = "./images/srs_starbase.png";

        gridImg = new Image();
        gridImg.src = "./images/srs_scangrid.png";
    };

//*********************************************************
    this.updateShortRangeScanner = function()
    {
        srsCtx.clearRect(0, 0, 180, 180);
        srsCtx.fillStyle = "#cccccc";
        srsCtx.drawImage(gridImg, 0, 0, 160, 160, 0, 0, 160, 160);

        // Calc camera angle in radians
        var zVec = quatToEuler(flight.camera.quaternion);
        var camRotation = eulerToAngle(zVec.y);

        // Draw any objects floating around our current star system
        for (i = 0; i < st.curSystem.obj.length; i++)
        {
            var obj = st.curSystem.obj[i];
            if (obj.mesh)
            {
                var vect = rect2polar(flight.camera.position.x,
                    flight.camera.position.z,
                    camRotation,
                    obj.mesh.position.x,
                    obj.mesh.position.z);

                if (vect.distance < 1800)
                {
                    var ox = 90 + ((Math.sin(vect.angle * st.RADUNIT) * vect.distance) / 25);
                    var oy = 110 - ((Math.cos(vect.angle * st.RADUNIT) * vect.distance) / 25);
                    if (obj === tShip)
                    { srsCtx.drawImage(enemyImg, 0, 0, 10, 8, ox-4, oy-3, 10, 8) }
                    else
                    if (obj === tPlanet)
                    { srsCtx.drawImage(planetImg, 0, 0, 16, 16, ox-7, oy-7, 16, 16) }
                    else
                    if (obj === tStarbase)
                    { srsCtx.drawImage(starbaseImg, 0, 0, 10, 10, ox-4, oy-4, 10, 10) }
                    else
                    { srsCtx.fillRect(ox-2,oy-2,4,4) }
                }
            }
        }
    };

    //*******************************************
    this.srsHide = function () {
        this.srsActive = false;
        $('#srs').css('display', 'none');
    };

    //*******************************************
    this.srsShow = function () {
        this.srsActive = true;
        $('#srs').css('display', 'block');
    };

//*********************************************************
    this.createLongRangeScanner = function()
    {
        console.log("Creating Long Range Scanner...");
        lrsCanvas = document.createElement('canvas');
        lrsCanvas.id = "lrs";
        lrsCanvas.width = 500;
        lrsCanvas.height = 500;
        lrsCtx = lrsCanvas.getContext('2d');
        lrsCtx.font = "16px arial";

        $('#screen').append('<div id="lrsContainer"><span id="lrsLabel">LONG RANGE SCANNER</span></div>');
        $('#lrsContainer').append(lrsCanvas);

        // Load Scanner Icons
        shipImg = new Image();
        shipImg.src = "./images/lrs_ship.png";
    };

//*********************************************************
    this.updateLongRangeScanner = function()
    {
        lrsCtx.fillStyle = "#004400";
        lrsCtx.fillRect(0, 0, st.LRS_WIDTH, st.LRS_HEIGHT);
        lrsCtx.font = "12px arial";
        lrsCtx.strokeStyle = "#eeeeee";
        lrsCtx.fillStyle = "#ffffff";
        //	ctx.drawImage(flight.lrscanner.gridImg, 0, 0, 160, 160, 10, 30, 160, 160);

        var scaler = (st.SYS_WIDTH / st.LRS_WIDTH);
        // Draw any objects floating around our current star system
        for (i = 0; i < st.curSystem.obj.length; i++)
        {
            var obj = st.curSystem.obj[i];
            if (obj.mesh)
            {
                var scaleX = (st.LRS_WIDTH / 2)+10 + (obj.mesh.position.x / scaler);
                var scaleY = (st.LRS_WIDTH / 2)+10 + (obj.mesh.position.z / scaler);

                if (obj === tShip) {
                    lrsCtx.drawImage(enemyImg, 0, 0, 10, 8, scaleX-7, scaleY-5, 15, 12)
                    lrsCtx.beginPath();
                    lrsCtx.moveTo(scaleX-7, scaleY-7);
                    lrsCtx.lineTo(scaleX-20, scaleY-20);
                    lrsCtx.lineTo(scaleX-25, scaleY-20);
                    lrsCtx.stroke();
                    lrsCtx.fillText("SHIP", scaleX-52, scaleY-17);
                }
                else if (obj === tPlanet) {
                    lrsCtx.drawImage(planetImg, 0, 0, 16, 16, scaleX-7, scaleY-7, 16, 16);
                    lrsCtx.beginPath();
                    lrsCtx.moveTo(scaleX+7, scaleY-7);
                    lrsCtx.lineTo(scaleX+20, scaleY-20);
                    lrsCtx.lineTo(scaleX+25, scaleY-20);
                    lrsCtx.stroke();
                    lrsCtx.fillText("PLANET", scaleX+28, scaleY-17);
                } else if (obj === tStarbase) {
                    lrsCtx.drawImage(starbaseImg, 0, 0, 10, 10, scaleX-7, scaleY-7, 16, 16)
                    lrsCtx.beginPath();
                    lrsCtx.moveTo(scaleX+7, scaleY-7);
                    lrsCtx.lineTo(scaleX+20, scaleY-20);
                    lrsCtx.lineTo(scaleX+25, scaleY-20);
                    lrsCtx.stroke();
                    lrsCtx.fillText("STARBASE", scaleX+28, scaleY-17);
                } else {
                    lrsCtx.fillRect(scaleX-3,scaleY-3,6,6);
                }
            }
        }

        var scaleX = (st.LRS_WIDTH / 2)+10 + (flight.camera.position.x / scaler);
        var scaleY = (st.LRS_WIDTH / 2)+10 + (flight.camera.position.z / scaler);

        lrsCtx.drawImage(shipImg, 0, 0, 16, 16, scaleX-7, scaleY-7, 16, 16);
        lrsCtx.beginPath();
        lrsCtx.moveTo(scaleX+7, scaleY+7);
        lrsCtx.lineTo(scaleX+20, scaleY+20);
        lrsCtx.lineTo(scaleX+25, scaleY+20);
        lrsCtx.stroke();
        lrsCtx.fillText("UND", scaleX+28, scaleY+24);
    };

    //*******************************************
    this.lrsHide = function () {
        this.lrsActive = false;
        $('#lrsContainer').css('opacity', 0);
        setTimeout(function() { $('#lrsContainer').css('display', 'none'); }, 250);
    };

    //*******************************************
    this.lrsShow = function () {
        this.lrsActive = true;
        $('#lrsContainer').css('display', 'block');
        setTimeout(function() { $('#lrsContainer').css('opacity', 1); }, 50);
    };


}).apply(SCANNERS);

