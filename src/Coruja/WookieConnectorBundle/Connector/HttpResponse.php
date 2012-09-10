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
 * HTTP Response class, handles HTTP status codes and response text 
 * @package org.wookie.php
 */

class HttpResponse {

	private $statusCode;
	private $responseText;
	private $header;
	
	/** Create new HTTP response
	 * 
	 * @param String response from server
	 * @param String headers from server
	 */
	
	function __construct($responseText, $header) {
		 //get http status code
		preg_match('|HTTP/\d\.\d\s+(\d+)\s+.*|',$header[0],$outcome);
		
		//store information
		$this->statusCode = (int) $outcome[1];
		$this->responseText = $responseText;
		$this->header = $header;
	}
	
	/** Get response text
	 * @return String response text
	 */
	
	public function getResponseText() {
		return $this->responseText;
	}
	
	/** Get HTTP status code
	 * @return Integer status cde
	 */
	
	public function getStatusCode() {
		return (int) $this->statusCode;
	}
	
	/** Get header
	 * @return Array header array
	 */
	public function getHeader() {
		return $this->header;
	}
	
	/** Get header as string
	 * @return String header as string
	 */
	
	public function headerToString() {
		return implode("\r\n", $this->getHeader());
	}
	
}
?>