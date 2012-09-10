<?php

namespace Coruja\WookieConnectorBundle\Connector;

/** @package org.wookie.php */

/*
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A collection of known widget instances available to a host.
 * @package org.wookie.php
 */

class WidgetInstances {
	private $WidgetInstances = array();
  
  /**
   * Record an instance of the given widget.
   * 
   * @param WidgetInstance instance of widget
   */
	
 public function put($instance) {
    $this->WidgetInstances[$instance->getIdentifier()] = $instance;
  }
  
  /** Get all Widget instances 
   * @return array array of widget instances 
   */
  
  public function get() {
	return $this->WidgetInstances;
  }
}

?>