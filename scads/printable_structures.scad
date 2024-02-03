/*
    This work is licensed under a Creative Commons Attribution 4.0 International License.
    Downloaded from www.sol75.com
*/
// FIXME: use ../constants.scad
$fs = 0.1;

include <constants.scad>;



//A0A0_wing_struct_0_NULL();
module A0A0_wing_struct_0_NULL(){
    color("LightSteelBlue"){
        translate([0,0,spar_h/2]){
            rotate([0,0,sweep])rotate([0,-theta,0]) translate([stand_off_l + (spar_l + insertion_l)/2,0,0]) iso_beam();
            mirror([1,0,0]) rotate([0,0,sweep]) rotate([0,-theta,0]) translate([stand_off_l + (spar_l + insertion_l)/2,0,0]) iso_beam();
        }

    rotate([0,0,180])center_body();
   }
}

A0A0_wing_struct_0_STAND_ALONE_PRINT();
module A0A0_wing_struct_0_STAND_ALONE_PRINT(){
    translate([0,-0.75*spar_h,spar_w/2]) iso_beam_print();

    translate([0,0.75*spar_h,spar_w/2]) iso_beam_print();

    translate([0,4*spar_h,(spar_w + min_tol + perimeter_t*2)/2])rotate([90,0,0]) center_body();
}

//iso_beam();
module iso_beam(){
     rotate([90,0,0]) iso_beam_print();
}

//!iso_beam_print();
module iso_beam_print(){
    /* Composed of a top and bottom skin, which contribute to the main inertia
        + an iso pattern which holds them together

        NB: Designed in the printerd orientation!
    */

    l = spar_l +insertion_l;
    iso_side = 2*spar_h*tan(30);
    n_holes = floor(spar_l/iso_side);

    module iso_beam_net(){
      // The equilateral triangle pattern
      linear_extrude(iso_el_t,center = true)
      union(){
          for(i=[-n_holes/2:n_holes/2]){
            translate([i*iso_side,0,0]) rotate([0,0,60]) square([iso_side -skin_t ,iso_el_width],center = true );
            translate([(i + 0.5)*iso_side,0,0]) rotate([0,0,-60])square([iso_side - skin_t,iso_el_width],center = true );
       }
      }
    }

    difference(){
    union(){
        //Add top and bottom skins
        translate([0,-(spar_h/2-skin_t/2),0]) cube([l,skin_t,spar_w],center = true);
        translate([0,+(spar_h/2-skin_t/2),0]) cube([l,skin_t,spar_w],center = true);

        union(){
               translate([0,0, spar_w/2 -iso_el_t/2]) iso_beam_net();
               translate([0,0,- (spar_w/2 -iso_el_t/2)]) mirror([0,1,0])iso_beam_net();
        }

        //Add End reinforcement
        translate([-(l/2 - insertion_l/2),0,spar_w/2 -iso_el_t/2])  cube([insertion_l,spar_h,iso_el_t],center = true);
        translate([-(l/2 - insertion_l/2),0,-(spar_w/2 -iso_el_t/2)])  cube([insertion_l,spar_h,iso_el_t],center = true);

        //On free end needs less reinforcement
        translate([l/2 - insertion_l/4,0,spar_w/2 -iso_el_t/2])  cube([insertion_l/2,spar_h,iso_el_t],center = true);
        translate([l/2 - insertion_l/4,0,-(spar_w/2 -iso_el_t/2)])  cube([insertion_l/2,spar_h,iso_el_t],center = true);

        //Add pin on one en
        translate([-(l/2 - insertion_l/2),0,0]) cylinder(d = pin_d + min_tol + 2*perimeter_t, h = spar_w - p0, center = true);
    }
      //Remove pin space
      translate([-(l/2 - insertion_l/2),0,0]) cylinder(d = pin_d  + min_tol , h = 1.2*spar_w, center = true);
    }
}

//!center_body();
module center_body(){
    wing_attachment_structure();
    //Add skid
    if(use_skid==1){
       translate([0,body_l/2 - (spar_w + 2*perimeter_t + 2*min_tol)/2,0]) skid();
    }
}

//!wing_attachment_structure();
module wing_attachment_structure(){
    //If there is no sweep, it can print without support, otherwise it will need some
    anchor_l = insertion_l + stand_off_l;
    //Needs to be wider due to more inaccuracies caused by the bridge
    // Also use loose tolerances to be sure it will work
    anchor_w = spar_w + 2*perimeter_t + 2*min_tol;
    anchor_h = spar_h + 2*perimeter_t + 1.5*min_tol;
    module anchor_tube(){
         small_distance = 2;
         translate([anchor_l/2 + small_distance/2,0,0])cube([anchor_l - small_distance,anchor_w , anchor_h],center = true);
    }

    module anchor_neg(){
        translate([insertion_l/2 + stand_off_l,0,0])cube([insertion_l + min_tol*2 ,spar_w + 2*min_tol , spar_h + 1.5*min_tol],center = true);
        translate([insertion_l/2 + stand_off_l,0,0]) cube([pin_d + min_tol,anchor_w*2.2,spar_h],center = true);
    }

    module connection_body(){
        // Center body to close gaps
        hull(){
            translate([0,0,spar_h/2 +0.5])cube([stand_off_l*2 + insertion_l/2,anchor_w-p0,anchor_h-1],center = true);
            translate([0,0,spar_h/2-tube_z_pos])rotate([90,0,0])cylinder(d = body_d + perimeter_t,h = anchor_w-p0, center = true);
        }
    }

    module back_support(){
          hull(){
            translate([0,anchor_w/2-0.5,spar_h]) rotate([90,0,0])cylinder(d = 1,h=1, center = true);
            translate([0,body_l/2 - anchor_w/2,spar_h/2-tube_z_pos]) rotate([90,0,0])cylinder(d = body_d + 2*perimeter_t + min_tol,h=body_l, center = true);
        }

    }

    //Put everything together
    difference(){
        union(){
            translate([0,0,spar_h/2]){
                rotate([0,0,-sweep]) rotate([0,-theta,0]) anchor_tube();
                mirror([1,0,0]) rotate([0,0,-sweep]) rotate([0,-theta,0]) anchor_tube();
            }
            connection_body();
            back_support();
        }
        //Take out spar space
        translate([0,0,spar_h/2]){
            rotate([0,0,-sweep]) rotate([0,-theta,0]) anchor_neg();
            mirror([1,0,0]) rotate([0,0,-sweep]) rotate([0,-theta,0]) anchor_neg();
        }
        //take out body tube volume
        //translate([0,0, -(body_d +perimeter_t*2)/2]) rotate([90,0,0]) cylinder(d=body_d + min_tol,h = body_l*2,center = true);
        translate([0,0,spar_h/2 -tube_z_pos]) rotate([90,0,0]) cylinder(d=body_d + min_tol,h = body_l*2,center = true);

    }
}

//!skid();
module skid(){
//Finger holder + hole for M3 screw
  skid_d = 10;

  translate([0,0,spar_h/2-tube_z_pos - body_d/2 - perimeter_t/2])
   difference(){
      hull(){
         translate([0,0,-perimeter_t/2])cube([2*perimeter_t,body_l,perimeter_t],center = true);
         translate([0, -body_l/2 + skid_d*sin(45)/2,-skid_l]) rotate([0,0,90])gentle_skid(d = skid_d, h = perimeter_t);
      }
      //funny shape for printing
      translate([0,-body_l/2 + skid_d*sin(45)/2,-skid_l + hole_d/2 + perimeter_t])hull(){
          rotate([0,90,0]) cylinder(d = hole_d+min_tol,h = 2*perimeter_t, center = true );
          translate([0, hole_d/4*1.41,0])rotate([0,90,0]) cylinder(d = hole_d/2*1.41,h = 2*perimeter_t, center = true,$fn = 4);
      }
  }

}


//gentle_skid();
module gentle_skid(d = 10,h = 1){
   y_at_45_deg = d/2*cos(45);
   remaining_h = d/2- y_at_45_deg;
   rotate([90,0,0])
   translate([0,remaining_h/2,0])
   intersection(){
        translate([0,d/2*cos(45),0])cylinder(d = d, h =h, center =true);
        translate([0,-d/2,0])cube([d,d,h],center = true);
   }
}

