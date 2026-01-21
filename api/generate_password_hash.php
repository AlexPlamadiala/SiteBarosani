<?php
// Script pentru a genera hash pentru parola admin

$password = "112112";
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Parola: " . $password . "\n";
echo "Hash: " . $hash . "\n";
echo "\n";
echo "Verificare: " . (password_verify($password, $hash) ? "OK" : "FAIL") . "\n";
echo "\n";
echo "SQL pentru update:\n";
echo "UPDATE users SET password = '" . $hash . "' WHERE username = 'admin';\n";
?>
