# Wprowadzenie

Pierwotnym celem aplikacji było przechowywanie wyników badań medycznych, np. wagi, temperatury czy pomiarów cukru.
Jednak z rozwojem, doszedłem do wniosku, że aplikacja może przechowywać różne wyniki.

Aplikacja jest "sprawdzaniem" umiejętności związanych z technologiami:

- Docker
- Node.JS
- WebPack
- MongoDB
- Passport do logowania przez Google i Facebook
- Express.js
- Handlebars
  
# Podstawowe cele aplikacji

- Definiowanie struktury badań z podziałem na grupy
- Definiowanie składników badań tj. wartości pomiarów i norm
- Kolekcjonowanie pomiarów
- Prezentacja pomiarów

# Uruchomienie

Jak na razie, uruchomienie aplikacji składa się z kilku kroków:

1. Docker-compose
2. Konfiguracja
3. Webpack
4. Serwer
   
## Docker-compose

Generalnie wykorzystany do uruchomienia serwera baz danych MongoDB, ale jeśli posiadasz MongoDB to nie musisz go uruchamiać.

`docker-compose up`

## Konfiguracja

Podstawowa konfiguracja aplikacji znajdue się w pliku `/config/config.env`, a poszczególne jej elementy definiują:

`PORT` - port pod którym uruchamiany jest serwer, domyślnie 3000

`MONGO_URI` - adres serwera baz danych MongoDB

Sekcja `Google` - definiuje parametry dostępowe do interfejsu Google API usługi logowania.

Sekcja `Facebook` - definiuje parametry dostępowe do interfejsu Facebook API usługi logowania

## Webpack
Tworzy statyczną stronę interfejsu użytkownika, ale do pełnego działania wymaga uruchomionego serwera.

Uruchom polecenie:

`npm run build`

## Serwer
Jak na razie dostępna jest tylko wersja deweloperska aplikacji.

`npm run dev`

## Przeglądarka

W swojej ulubionej przeglądarce wpisz adres `http://localhost:3000` (lub zamiast :3000 wpisz numer portu który jest ustawiony w konfiguracji)

# Znane i nie rozwiązane problemy

* [ ] Frontend uruchamiany przez `npm run serv` nie może zalogować się przy użyciu logowania Google.

     Nie wiem, jak rozwiązać problem z CORS i pobrać żądanie.

* [ ] Nadal nie wiem, jak poprawnie skonfigurować Facebooka API for Developers, aby móc zalogować się za pomocą konta Facebook.
  
* [x] Jak skonfigurować WebPack do „ściągania” używanych plików statycznych (grafiki itp.) z szablonów Handlebars.
  
     Z tego co się dowiedziałem, wtyczka Webpack `CopyWebpackPlugin` jest rozwiązaniem. Pośrednim, ale akceptowalnym.
     Jednak, nie mogłem znaleźć rozwiązania, które analizowałoby szablony pod kątem wykorzystania w nich obrazów i ich wyodrębnienia.

* [ ] Nurtującym problemem jest integrowanie Bootstrapa i jQuery w środowisku Webpack.

    Obecnie wczytuje te biblioteki z zewnętrznego źródła (CDN) co nie pozwala na pełną integrację aplikacji.

    **Co się dzieje, gdy próbuję zintegrować Bootstrap oraz jQuery?**

    Zaburzone zostaje przydzielanie zdarzeń do elementów interaktywnych Bootstrapa. Powoduje to, np.
  - tworzenie wielu kopi `backdrop` dla elementu modal
  - brak reakcji na przycisk otwierający 'dropdown'
  - obciążenie przeglądarki.