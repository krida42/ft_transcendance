#!/bin/bash
psql -U utilisateur -h localhost -c "CREATE DATABASE IF NOT EXISTS database_development;"
