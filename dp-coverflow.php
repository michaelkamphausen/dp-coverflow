<?php
/*
Plugin Name: Digital Pioneers Coverflow
Description: Allows you to pick a gallery from the 'NextGen Gallery' plugin to use as Coverflow.
Author: Digital Pioneers N.V.
Author URI: http://digitalpioneers.de/
Version: 1.0
*/

if ( ! defined( 'WPDP_COVERFLOW_PLUGIN_BASENAME' ) )
	define( 'WPDP_COVERFLOW_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

if ( ! defined( 'WPDP_COVERFLOW_PLUGIN_NAME' ) )
	define( 'WPDP_COVERFLOW_PLUGIN_NAME', trim( dirname( WPDP_COVERFLOW_PLUGIN_BASENAME ), '/' ) );

if ( ! defined( 'WPDP_COVERFLOW_PLUGIN_DIR' ) )
	define( 'WPDP_COVERFLOW_PLUGIN_DIR', WP_PLUGIN_DIR . '/' . WPDP_COVERFLOW_PLUGIN_NAME );

function WPDP_COVERFLOW_set_plugin_meta($links, $file)
{
  $plugin = WPDP_COVERFLOW_PLUGIN_BASENAME;
  return $links;
}
if( is_admin() )
{
  add_filter( 'plugin_row_meta', 'WPDP_COVERFLOW_set_plugin_meta', 10, 2 );
}

require_once WPDP_COVERFLOW_PLUGIN_DIR . '/includes/application.php';