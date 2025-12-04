<?php
$currentPage = 'dashboard';
require_once '../config.php';

if (!isAuthenticated()) {
	header('Location: /admin/login.php');
	exit;
}

requireAuth();

include 'layout-header.php';
include 'dashboard-content.php';
include 'layout-footer.php';
