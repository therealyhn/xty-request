<?php

declare(strict_types=1);

require_once __DIR__ . '/Database.php';

function getSetting(string $name): ?string
{
    $stmt = db()->prepare('SELECT value FROM settings WHERE name = :name LIMIT 1');
    $stmt->execute([':name' => $name]);
    $row = $stmt->fetch();
    if (!$row || !isset($row['value'])) {
        return null;
    }
    return (string) $row['value'];
}

function setSetting(string $name, string $value): void
{
    $stmt = db()->prepare(
        'INSERT INTO settings (name, value) VALUES (:name, :value)
         ON DUPLICATE KEY UPDATE value = VALUES(value)'
    );
    $stmt->execute([
        ':name' => $name,
        ':value' => $value,
    ]);
}
