<?php 
$wordid = $_GET['wordid'] ?? '';
try{
    $db = new PDO('sqlite:' . __DIR__ . '/dictionary.db');
    
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $translationQuery = $db->prepare('SELECT tl FROM "russian3 - translations" WHERE word_id = :wordid AND lang="en"');
    $translationQuery->bindValue(':wordid', $wordid, PDO::PARAM_STR);
    $translationQuery->execute();
    foreach($translationQuery as $row){
        echo htmlspecialchars($row['tl']) . " ";
    }
    $db = null;
}
catch(PDOException $e){
    
    ECHO "dATABASE ERROR: " . $E->getMessage();
}
?>
