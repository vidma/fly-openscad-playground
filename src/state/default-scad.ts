// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

export default `/* 
    This work is licensed under a Creative Commons Attribution 4.0 International License.
    Downloaded from www.sol75.com
*/

$fs = 1;
include <constants.scad>;
use<printable_structures.scad>;
use<printable_airfoil_segments.scad>;



A0_glider_s0_NULL();

module A0_glider_s0_NULL(){
    A0A0_wing_struct_0_NULL();

    module ribs_in_place(){
        rotate([0,0,sweep]) rotate([0,-theta,0]){
        //First with an offset
        translate([20,0,spar_h/2]) mirror([-1,0,0])rotate([0,90,0]) rotate([0,0,90]) A0A1_NACA_4d_0_NULL();
        for(i = [1:rib_n-1]){
            translate([spar_l/(rib_n-1)*i + 10,0,spar_h/2]) mirror([-1,0,0])rotate([0,90,0]) rotate([0,0,90]) A0A1_NACA_4d_0_NULL();
       }
    }

    }
    //one wing ribs
    ribs_in_place();
   //mirror for the other
    mirror([1,0,0])ribs_in_place();

 }

module A0_glider_s0_STAND_ALONE_PRINT(){
   //nothing to do here
}

module A0_glider_s0_NEGATIVE(){
   //nothing to do here
}

module A0_glider_s0_POSITIVE(){
   //nothing to do here
}
`