<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * pdfprotect module capability definition
 *
 * @package   mod_pdfprotect
 * @copyright 2025 Eduardo kraus (http://eduardokraus.com)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

$capabilities = [
    "mod/pdfprotect:view" => [
        "captype" => "read",
        "contextlevel" => CONTEXT_MODULE,
        "archetypes" => [
            "guest" => CAP_ALLOW,
            "user" => CAP_ALLOW,
        ],
    ],
    "mod/pdfprotect:addinstance" => [
        "riskbitmask" => RISK_XSS,

        "captype" => "write",
        "contextlevel" => CONTEXT_COURSE,
        "archetypes" => [
            "editingteacher" => CAP_ALLOW,
            "manager" => CAP_ALLOW,
        ],
        "clonepermissionsfrom" => "moodle/course:manageactivities",
    ],
];
