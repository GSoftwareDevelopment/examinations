# Handlebars helpers by GSD

Handlebars to jedno z bardziej interesujących narzędzi do tworzenia szablonów, dzięki możliwości tworzenia własnych "helpers".

## Conditional

Podstawowy warunek `if` w Handlebars, był bardzo skromny i nie pozwalał na precyzyjniejsze określenie warunku.
Poniżej opisałem kilku pomocników, którzy to ograniczeni znoszną.

**UWAGA:** Należy mieć na uwadze, że poniższe funkcje dokonują porównań biorąc pod uwagę typy argumentów. Jeżeli typy nie będą zgodne, wynikiem będzie `false`.

### `eq {arg1} {arg2}`

Zwrca `true` jeżeli podane argumenty (`arg1` i `arg2`) są sobie równe. W przeciwnym wypadku, zwraca `false`.

**Przykład:**

```hbs
{{#if (eq page 0)}}
    <div>To jest początek artykułu</div>
{{/if}}
```

### `neq {arg1} {arg2}`

Działa odwrotnie do funckji `eq`.

**Przykład:**

```hbs
{{#if (neq page 0)}}
    <div>To nie jest początek artykułu</div>
{{/if}}
```

Podobny rezultat można uzyskać stosując operację logiczną `not`, np.

```hbs
{{#if (not (eq page 0))}}
    <div>To nie jest początek artykułu</div>
{{/if}}
```

### `lt {arg1} {arg2}`

Zwraca `true` jeżeli `arg1` jest mniejszy od `arg2`

### `eqlt {arg1} {arg2}`

Zwraca `true` jeżeli `arg1` jest mniejszy lub równy `arg2`

### `gt {arg1} {arg2}`

Zwraca `true` jeżeli `arg1` jest większy od `arg2`

### `eqgt {arg1} {arg2}`

Zwraca `true` jeżeli `arg1` jest większy lub równy `arg2`

## Operacje logiczne

### `and {arg1} {arg2}`

Zwraca wynik operacji logicznej AND
```
+-------+-------+-------+
| arg1  | arg2  | Wynik |
+-------+-------+-------+
| false | false | false |
| false | true  | false |
| true  | false | false |
| true  | true  | true  |
+-------+-------+-------+
```

### `or {arg1} {arg2}`

Zwraca wyniki operacji logicznej OR

```
+-------+-------+-------+
| arg1  | arg2  | Wynik |
+-------+-------+-------+
| false | false | false |
| false | true  | true  |
| true  | false | true  |
| true  | true  | true  |
+-------+-------+-------+
```

### `not {arg}`

Negacja logiczna (NOT)

```
+-------+-------+
| arg1  | Wynik |
+-------+-------+
| false | true  |
| true  | false |
+-------+-------+
```

## Sprawdzanie typów

Zdefiniowałem kilku pomocników, których zadaniem jest możliwość sprawdzenia typu zmiennej.Jest ich pięć:
- `isUndefined`,
- `isNull`,
- `isNumber`,
- `isString`,
- `isObject`.

Każda z funkcji przyjmuje jeden argument i zwraca odpowiednio `true` lub `false` w zależności, czy argument jest typem na jaki wskazuje nazwa funkcji.

### Budowanie warunków w HBS

Tworzenie warunków z użyciem składni, jaką oferuje Handlebars, jest (mówiąc łagodnie) katorgą, ale nie jest niemożliwe.
Jeśli próbowałeś tworzyć złożone warunki w Excel'u to może Ci to przypominać właśnie tą składnie.

Oto prosty przykład:

Zapis JavaScript:
```js
if ((count>0) and (count<10)) {
    console.log('Wartość zmiennej mieści się w zakresie 1 do 9');
}
```

Zapis HBS:
```hbs
{{#if (and (gt count 0) (lt count 10))}}
Wartość zmiennej mieści się w zakresie 1 do 9
{{/if}}
```

Odrobina wprawy i można budować skomplikowane warunki. TIP: Pomocne mogą być dodatki do edytorów automatycznie zamykające nawiasy.

## Counters

Liczniki są swego rodzaju odpowiednikiem zmiennych. Mają zasięg globalny, a dokładniej, nie są zależne od kontekstu wywołania.

### `set "name" {value}`

Ustawia licznk o nazwie `name` na wartość `value`.

Przykład:
```hbs
{{set "count" 0}}
```
Ustawia licznik o nazwie "count" na wartość zero (0)

```hbs
{{set "count" pages}}
```
Ustawia licznik o nazwie "count" na wartość jaką wskazuje zmienna `pages` przekazana do szablonu.


### `get "name"`

Zwraca stan licznika o nazwie `name`

Przykład:
```hbs
{{get "count"}}
```
Pobierze wartość licznika o nazwie "count" i przekaże go do szablonu - w efekcie, w szablonie pokarze się liczba.

```hbs
{{#if (eq (get "count") 0)}}
Counter is zero
{{/if}}
```
Przykład wykorzystania licznika w warunku. Warunek zostanie spełniony, gdy licznik będzie równy zero (0).

### `inc|dec "name"`

Dokonuje zwiększenia `inc` lub zmniejszenia `dec` licznika `name` o 1.

### `isZero "name"`

Zwraca `true` jeżli licznik `name` jest równy zero (0).

**Przykad:**
```hbs
{{#if (isZero "count")}}
Counter is zero
{{/if}}
```
Podobnie jak w przykładzie funkcji `get` tak i tutaj, warunek zostanie spełniony, gdy licznik będzie równy zero (0).

# Iterations

### `#loop {from} {to}`

Przetwarzająca zawarty wewnątrz blok rządaną ilość razy. Zakres ustalają parametry `from` i `to`. Zaznaczyć trzeba, że parametr `to` jest badany warunkiem `<=` co oznacza, że ilość iteracji jest zawsze mniejsza o jeden.

W pętli można uzyskać informacje o aktualnym kroku korzystając ze zmiennej `@index`. Dodatkowo jest możliwość sprawdzenia, czy pętla jest na początku, czy też na końcu wykonwywania.
Informacji tych dostarczają zmienne `@first` i `@last`.

**Przyklad:**
```hbs
{{#loop 1 10}}
    <div>Step {{@index}}</div>
{{/loop}}
```
Efektem działania pętli będzie dziewięc elementów blokowych `<div>` zawierających liczby kolejno od 1 do 9.

# Math

### `add|sub|mul|div {arg1} {arg2}`

Podstawowe operacje matematyczne na dwóch argumentach `arg1` i `arg2`. Odpowiednio:
- `add` - dodawanie
- `sub` - odejmowanie
- `mul` - mnożenie
- `div` - dzielenie

Jako argument może być podana również nazwa licznika. W tym celu nazwa musi być ujęta w cudzysłowie.

### `isEven | isOdd {arg}`

Funkcje sprawdzające parzystość argumentu `arg`.