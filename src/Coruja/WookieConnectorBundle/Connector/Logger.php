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

/** Simple Logger class
 * @package org.wookie.php
 */

class Logger {

	private $path;

	/** Create new logger
	 * @param String path to writeable folder
	 */
	function __construct($path) {
		$this->setPath($path);
	}

	/** Set logger path
	 * 
	 * @param String path to writeable folder
	 */
	
	public function setPath($path) {
		$this->path = $path;
	}

	/** Get current logger path
	 * @return String current logger path
	 */
	public function getPath() {
		return $this->path;
	}

	/** Write data to log, if logger path is set
	 * 
	 * @param String input string
	 */
	public function write($str) {
		$path = $this->getPath();
		if(!empty($path)) {
		  if(is_dir($path)) {
			  $str = "[ ".date("d/m/Y H:i:s")." ] ".$str."\n";
			  $fileWriter = @file_put_contents($path."wookie_php.0.log", $str, FILE_APPEND);
			  if(!$fileWriter) {
				  echo "<b>Wookie PHP: Writing to log failed, check permissions/path</b>";
			  }
		  } else {
			  echo "<b>Wookie PHP: Path is not a directory</b>";
		  }
	  }
	}

}

?>
