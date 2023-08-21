#!/bin/bash
source .env

TEST=$(psql -U $DB_USER -h $DB_HOST -tAc "SELECT datname FROM pg_database");
echo "TEST=$TEST"

if [[ $TEST == *"$DB_NAME"* ]]; then
  echo "La base de données existe déjà."
else
  psql -U $DB_USER -h $DB_HOST -c "CREATE DATABASE $DB_NAME;"
  echo "Base de données créée avec succès."
fi
