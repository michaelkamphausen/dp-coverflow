<?php

require_once WPDP_COVERFLOW_PLUGIN_DIR . '/includes/functions.php';
require_once WPDP_COVERFLOW_PLUGIN_DIR . '/includes/dp_coverflow.php';

add_action( 'widgets_init', create_function('', 'return register_widget("DP_Coverflow");') );
add_shortcode( 'dp-coverflow', 'dp_coverflow_shortcode_handler' );

if( !is_admin() )
{
  add_action( 'init', 'WPDP_COVERFLOW_enqueue_scripts' );
  add_action( 'init', 'WPDP_COVERFLOW_enqueue_styles' );
}

?>