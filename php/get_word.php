<?php
try {
    $db = new PDO('sqlite:' . __DIR__ . '../dictionary.db');
    $name = $_GET['name'] ?? '';
    $searchType = $_GET['searchtype'] ?? '';
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Get Adjectives
    if($name != null && $name != ""){
        if($searchType == "Exact"){
            $stmt = $db->prepare('SELECT form_bare, word_id, form, form_type FROM "russian3 - words_forms" WHERE form_bare = :name');
            $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        } 
        else{
            $stmt = $db->prepare('SELECT form_bare, word_id, form, form_type FROM "russian3 - words_forms" WHERE form_bare LIKE :name');
            $stmt->bindValue(':name', $name . '%', PDO::PARAM_STR);
            
        }
        $stmt->execute();
        foreach ($stmt as $row) 
            {
                echo "<tr class='bare' id='" . htmlspecialchars($row['word_id']) . "'>"
                . "<td class='word'>" . htmlspecialchars($row['form_bare'] ?? '') . "</td>"
                . "<td>" . htmlspecialchars($row['form'] ?? '') . "</td>"
                . "<td class='hidden'>" . htmlspecialchars($row['form_type'] ?? '') . "</td>"
                . "</tr>";
            }
    }
    $db = null;

    } catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . $name . $searchType;
}
    
?>
