var DEG2RAD = 180/Math.PI;
//*********************************************************
function rect2polar(sx, sz, roty, tx, tz)
{
	var dx = tx - sx;
	var dz = sz - tz;
	var dist = ~~(Math.sqrt((dx * dx) + (dz * dz)));
	var angle = Math.round(Math.atan2(Math.abs(dz),Math.abs(dx)) * DEG2RAD);

	if (dz >= 0)
		{ angle = (dx < 0) ? 270+angle : 90-angle; }
	else
		{ angle = (dx < 0) ? 270-angle : 90+angle; }

	angle -= roty;
	if (angle < 0) angle += 360;
	
	return {angle:angle, distance:dist};
}

// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/
//*********************************************************
function quatToEuler (q1) {
	var pitchYawRoll = new THREE.Vector3();
     sqw = q1.w*q1.w;
     sqx = q1.x*q1.x;
     sqy = q1.y*q1.y;
     sqz = q1.z*q1.z;
	 unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
	 test = q1.x*q1.y + q1.z*q1.w;
	if (test > 0.499*unit) { // singularity at north pole
		heading = 2 * Math.atan2(q1.x,q1.w);
		attitude = Math.PI/2;
		bank = 0;
		return;
	}
	if (test < -0.499*unit) { // singularity at south pole
		heading = -2 * Math.atan2(q1.x,q1.w);
		attitude = -Math.PI/2;
		bank = 0;
		return;
	}
	else {
		heading = Math.atan2(2*q1.y*q1.w-2*q1.x*q1.z , sqx - sqy - sqz + sqw);
		attitude = Math.asin(2*test/unit);
		bank = Math.atan2(2*q1.x*q1.w-2*q1.y*q1.z , -sqx + sqy - sqz + sqw)
	}
	pitchYawRoll.z = Math.floor(attitude * 1000) / 1000;
	pitchYawRoll.y = Math.floor(heading * 1000) / 1000;
	pitchYawRoll.x = Math.floor(bank * 1000) / 1000;

	return pitchYawRoll;
}        

//*********************************************************
function eulerToAngle(roty) {
	var ca = 0;
	if (roty > 0)
		{ ca = st.TWOPI - roty; } 
	else 
		{ ca = -roty }
	
	return (ca / st.RADUNIT);
}


//*********************************************************
function randomRange(min, max) {
    return (Math.floor(Math.random() * (1 + max - min)) + min);
}

//*********************************************************
function oneIn(chance) {
    if (0 == Math.floor(Math.random() * (chance)))
        return true;
    return false;
}