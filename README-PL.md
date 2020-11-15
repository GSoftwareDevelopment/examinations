# Wprowadzenie

Pierwotnym celem aplikacji było przechowywanie wyników badań medycznych, np. wagi, temperatury czy pomiarów cukru.
Jednak z rozwojem, doszedłem do wniosku, że aplikacja może przechowywać różne wyniki.

Aplikacja jest "sprawdzaniem" umiejętności związanych z technologiami:

## Stack

- Javascript
- Node.JS

Backend:

- Express.js
- MongoDB
- Passport do logowania

Frontend:

- React
  
# Podstawowe cele aplikacji

- Definiowanie struktury badań z podziałem na grupy
- Definiowanie składników badań tj. wartości pomiarów i norm
- Kolekcjonowanie pomiarów
- Prezentacja pomiarów

# Uruchomienie

## Konfiguracja

Podstawowa konfiguracja aplikacji znajdue się w pliku `/config/config.env`, a poszczególne jej elementy definiują:

`PORT` - port pod którym uruchamiany jest serwer, domyślnie 3000

`MONGO_URI` - adres serwera baz danych MongoDB

## Backend

Po skonfigurowaniu `.env` uruchom poleceniem:

`npm run dev`

## Frontend

Wymagane jest uruchomienie backendu.

Wykonaj polecenie

`npm start`
