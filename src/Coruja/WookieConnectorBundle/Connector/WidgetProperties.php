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

/** Property class 
 * @package org.wookie.php
 **/

 class Property {
	private $propertyName = '';
	private $propertyValue = '';
	private $isPublic = 'false';
	
	/** Construct new property
	 * @param String property name
	 * @param String property value
	 * @param String is property public (handled as shareddatakey) or private
	 */
	
	function __construct($propertyName, $propertyValue = null, $isPublic = 'false') {
		$this->propertyName = (string) $propertyName;
		$this->propertyValue = (string) $propertyValue;
		$this->isPublic = (string) $isPublic;
	}
	
	/** Get property value
	 * @return String value of property
	 */
	
	public function getValue() {
		return $this->propertyValue;
	}
	
	/** Get property name
	 * @return String name of property
	 */
	
	public function getName() {
		return $this->propertyName;
	}
	
	/** Get property isPublic flag
	 * @return String isPublic flag of property
	 */
	
	public function getIsPublic() {
		return $this->isPublic;
	}
	
	/** Set property value
	 * 
	 * @param String new value
	 */
	
	public function setValue($value) {
		$this->propertyValue = (string) $value;
	}
	
	/** Set property name
	 * 
	 * @param String new name
	 */
	
	public function setName($propertyName) {
		$this->propertyName = (string) $propertyName;
	}
	
	/** Set isPublic flag
	 * 
	 * @param String isPublic flag, "true" or "false"
	 */
	
	public function setIsPublic($isPublic) {
		$this->isPublic = (string) $isPublic;
	}
	
 }

?>