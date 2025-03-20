# Vuosikello

Vuosikello on React-sovellus, joka auttaa suunnittelemaan ja visualisoimaan tapahtumia ja projekteja vuoden ajalle. Sovellus tarjoaa erilaisia näkymiä, kuten vuosikello, aikajana ja kuukausinäkymä.

## Ominaisuudet

- Vuosikellonäkymä tapahtumien visualisointiin
- Aikajananäkymä tapahtumien ajalliseen tarkasteluun
- Kuukausinäkymä kuukausikohtaiseen suunnitteluun
- Tapahtumien luominen, muokkaaminen ja poistaminen
- Projektien hallinta
- Tapahtumien suodattaminen

## Teknologiat

- React
- React Calendar
- React DatePicker
- CSS

## Käyttöönotto

Sovelluksen käynnistäminen kehitystilassa:

```bash
# Asenna riippuvuudet
npm install

# Käynnistä sovellus
npm start
```

Sovellus avautuu selaimessa osoitteessa [http://localhost:3000](http://localhost:3000).

## Tuotantoversion luominen

```bash
npm run build
```

Tuotantoversio luodaan `build`-kansioon.

## Projektin rakenne

- `public/`: Staattiset tiedostot
- `src/`: Lähdekoodi
  - `components/`: React-komponentit
  - `services/`: Palvelut ja rajapinnat
  - `styles/`: CSS-tyylitiedostot
  - `App.js`: Sovelluksen pääkomponentti
  - `index.js`: Sovelluksen käynnistyspiste

    Test
