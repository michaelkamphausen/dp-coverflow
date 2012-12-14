<?php

function WPDP_COVERFLOW_plugin_url( $path = '' )
{
  return plugins_url( $path, WPDP_COVERFLOW_PLUGIN_BASENAME );
}

function WPDP_COVERFLOW_enqueue_scripts()
{
  if( !is_admin() )
  {
    wp_enqueue_script( 'modernizr', 'http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.0.6/modernizr.min.js', array(), '', false);
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script( 'hammer', WPDP_COVERFLOW_plugin_url( 'js/hammer.js' ), array(), '', false );
    wp_enqueue_script( 'jquery.hammer', WPDP_COVERFLOW_plugin_url( 'js/jquery.hammer.js' ), array('jquery', 'hammer'), '', false );
    wp_enqueue_script( 'raf', WPDP_COVERFLOW_plugin_url( 'js/rAF.js' ), array(), '', false );
    wp_enqueue_script( 'photon', WPDP_COVERFLOW_plugin_url( 'js/photon.js' ), array(), '', false );
    wp_enqueue_script( 'dp-coverflow', WPDP_COVERFLOW_plugin_url( 'js/dp-coverflow.js' ), array('modernizr', 'jquery', 'jquery.hammer', 'raf', 'photon'), '', false );
  }
}

function WPDP_COVERFLOW_enqueue_styles()
{
  if( !is_admin() )
  {
    wp_enqueue_style( 'dp-coverflow', WPDP_COVERFLOW_plugin_url( 'css/dp-coverflow.css' ), array(), '', 'all' );
  }
}

function WPDP_COVERFLOW_use_default($instance, $key)
{
  return !array_key_exists($key, $instance) || trim($instance[$key]) == '';
}

function dp_coverflow_shortcode_handler($atts)
{
  $instance = array();
  foreach($atts as $att => $val)
  {
    $instance[wp_specialchars($att)] = wp_specialchars($val);
  }

  // Set defaults
  if(WPDP_COVERFLOW_use_default($instance, 'html_id')) { $instance['html_id'] = 'jcarousel'; }
  if(WPDP_COVERFLOW_use_default($instance, 'order')) { $instance['order'] = 'random'; }
  if(WPDP_COVERFLOW_use_default($instance, 'scroll')) { $instance['scroll'] = '1'; }
  if(WPDP_COVERFLOW_use_default($instance, 'visible')) { $instance['visible'] = '1'; }
  if(WPDP_COVERFLOW_use_default($instance, 'wrap')) { $instance['wrap'] = 'circular'; }
  $instance['shortcode'] = '1';

  ob_start();
  the_widget("DP_Coverflow", $instance, array());
  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}

?>