<?php 
    if (isset($_GET['language'])) {
        echo locale_get_display_language($_GET['language'], 'fr');
    }
?>