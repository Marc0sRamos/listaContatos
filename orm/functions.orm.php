<?php

function select(PDO $pdo, string $query): array {
    return $pdo->query($query)->fetchAll();
}

function query(PDO $pdo, string $query, array $parameter = null):bool {
  return $pdo->prepare($query)->execute($parameter);
}