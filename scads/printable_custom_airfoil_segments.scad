/*
    This work is licensed under a Creative Commons Attribution 4.0 International License.
    Downloaded from www.sol75.com
*/
$fs =0.05;
include <constants.scad>;

A0A1_NACA_4d_0_STAND_ALONE_PRINT();

//!A0A1_NACA_4d_0_NULL();
module A0A1_NACA_4d_0_STAND_ALONE_PRINT(){

    rotate([0,0,twist]) A0A1_NACA_4d_0_NULL();
    translate([-chord,0,0]) rotate([0,180,0])mirror([0,0,1])  rotate([0,0,twist]) A0A1_NACA_4d_0_NULL();
}

module A0A1_NACA_4d_0_NULL(chord = chord, perimeter_t = perimeter_t, h= rib_base_h, N=camber_max,A=camber_pos,CA=thickness_max){
   //A rib, with a perimeter and spar attachment point
   translate([0,-spar_y_offset,0])color("LightSteelBlue"){
   max_chamber = (N+A ==0)? 0.3*chord: A*0.1*chord;
   leading_edge_x = - max_chamber;
   max_t = CA*0.01*chord;

   //n_sections = 5;
   section_step = chord/n_sections;
   section_span = section_step + perimeter_t;

   rotate([0,0,-twist]){
   difference(){
      //linear_extrude(h,center = true) scale(chord) NACA_4digit_points(N,A,CA);
      union(){
          //Basic shape
          linear_extrude(h,center = true) scale(chord) NACA_4digit_points(N,A,CA);
          //Nose
          intersection(){
              hull(){
                  //Consider sweep also for nose and tail
              translate([0,0,-h/2])linear_extrude(p0,center = true) scale(chord) NACA_4digit_points(N,A,CA);
              translate([-protrusion_h*tan(sweep),0,protrusion_h])linear_extrude(p0,center = false) scale(chord) NACA_4digit_points(N,A,CA);
              }
              translate([leading_edge_x,0,-h/2]) cylinder(d1 =10, d2=5, h=protrusion_h*1.1, center = false);
          }
          //Trailing edge
          intersection(){
                 hull(){
                  //Consider sweep also for nose and tail
              translate([0,0,+h/2])linear_extrude(p0,center = true) scale(chord) NACA_4digit_points(N,A,CA);
              translate([-protrusion_h*tan(sweep),0,protrusion_h])linear_extrude(p0,center = false) scale(chord) NACA_4digit_points(N,A,CA);
              }
              translate([leading_edge_x+ chord,0,0]) cylinder(d1 =30, d2=5, h=protrusion_h*1.1, center = false);
          }
      }


      //add proper holes
      for(i=[0:n_sections]){
           linear_extrude(2.1*protrusion_h,center = true) offset(r = perimeter_t ) offset(r = -2*perimeter_t ) intersection(){
                scale(chord) NACA_4digit_points(N,A,CA);
                translate([leading_edge_x+section_span/2 + i*section_step,0,0])square([section_span,max_t*2],center = true);
                }
      }
      //hole for spar
     translate([0,spar_y_offset,0]) rotate([0,-sweep,0])rotate([0,0,twist])cube([spar_width + min_tol,spar_height + min_tol,8*h],center =true);

   }

   //Spar attachment, in the middle section
   difference(){
       union(){
       intersection(){
           linear_extrude(h,center = true) scale(chord) NACA_4digit_points(N,A,CA);
           rotate([0,0,twist]) translate([0,spar_y_offset,0])cube([spar_width + 2*perimeter_t+ min_tol + p0,2*max_t ,2*h],center =true);
           }
           //Add lateral support, but make sure it can not exit from below
           intersection(){
                rotate([0,-sweep,0])rotate([0,0,twist])translate([0,spar_y_offset,0])cube([spar_width + 2*perimeter_t+min_tol,spar_height + 2*perimeter_t+min_tol,2*protrusion_h],center =true);
                translate([0,0,protrusion_h])cube([chord,2*max_t, protrusion_h*2],center = true);
               }
        }
        //Take out spar volume
        rotate([0,-sweep,0])rotate([0,0,twist])translate([0,spar_y_offset,0])cube([spar_width + min_tol,spar_height + min_tol,3*protrusion_h],center =true);
   }

  }
  }
}


module NACA_4digit_points( max_camber = 2, max_camber_d = 2, max_t = 12, n_points = 80){
    /*  NACA 4  X Y ZZ series profile
        Returns the points for the profile; needs to be extruded afterwards
        Note that the profile is centered (in x direction ) on the max thickness point
    */

    m = max_camber*0.01;  // maximum camber (first digit * 100)
    p = max_camber_d*0.1; // position of the maxium camber (from leading edge)
    t = max_t*0.01; // Maximum thickness as % of chord

    max_thickness_point = (m ==0)? 0.3: p;

    // Eveyrtihng is expressed as function of s, where s in [0,1]. 0= leading ,1 = trailing
    //Camber line: Up to the max thickness
    function y_0(s) = m/pow(p,2)*( 2*p*s - pow(s,2) );
    //Camber line: after max thickness
    function y_1(s) = m/pow((1.0-p),2)*( (1-2*p) + 2*p*s - pow(s,2) );
    //Camber line total y
    function y_c(s) = (s < p)?y_0(s):y_1(s);

    // Before max thickness
    function dy_dx_0(s) = 2*m/pow(p,2)*(p-s);
    // After max thickness
    function dy_dx_1(s) = 2*m/(1-pow(p,2))*(p-s);
    //Derivative of camber line at x
    function dy_dx(s) = (s<p)? dy_dx_0(s): dy_dx_1(s);
    //Local normal at x
    function theta_x(s) = atan( dy_dx(s) );

    //Half thickness at point x
    function y_t(s) = 5*t*( 0.2969*sqrt(s) - 0.1260*s - 0.3516*pow(s,2) + 0.2843*pow(s,3) - 0.1015*pow(s,4) );

    function x_upper(s) = s - y_t(s)*sin( theta_x(s) );
    function y_upper(s) = y_c(s) + y_t(s)*cos(theta_x(s));

    function x_lower(s) = s + y_t(s)*sin( theta_x(s) );
    function y_lower(s) = y_c(s) - y_t(s)*cos(theta_x(s));

    //The points should not be equispaced, so  use cosine spacing (more point at start and end)
    function x_dist(s) = 0.5 + 0.5*cos(180 - s*180);

    //camber_points = [ for (i = [ 0 : n_points ]) let (x = i/n_points, y =y_c(x) ) [ x, y] ];
    //linear_extrude(1,scale=chord) polygon(camber_points);

    upper_points = [for (i= [0 : n_points]) let (s = x_dist(i/n_points), x = x_upper(s) , y = y_upper(s) )[x - max_thickness_point,y] ];
    //linear_extrude(1,scale=1) polygon(upper_points);

    lower_points = [for (i= [0 : n_points]) let (s= x_dist(1 - i/n_points), x = x_lower( s )  , y = y_lower(s) )[x- max_thickness_point,y] ];
    //%linear_extrude(1,scale=1) polygon(lower_points);

    full_profile = concat(upper_points,lower_points);
    //linear_extrude(1,scale=chord) polygon(full_profile);
    polygon(full_profile);
}

