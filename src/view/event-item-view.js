import {createElement} from '../render.js';
import {DATE_FORMATS} from '../const.js';
import {humanizeDate,calculateDuration} from '../utils.js';

//Создаем разметку для списка предложений
const createOffersListMarkup = (pointOffers, typeOffers) => pointOffers
  .map((pointOfferId) => { //Перебираем все id предложений, и в случае наличия информации в массиве создаем HTML-элемент li
    if (pointOffers.length && typeOffers.length) {
      const selectedOffer = typeOffers.filter((offer) => offer.id === pointOfferId)[0];
      return `<li class="event__offer">
          <span class="event__offer-title">${selectedOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${selectedOffer.price}</span>
        </li>`;
    }
  }).join('');

//Создаем класс для создания представления элемента события в UI
export default class EventItemView {
  constructor({eventPoint,offers,destination}) {
    this.eventPoint = eventPoint;
    this.offers = offers;
    this.destination = destination;
  }

  getTemplate() {
    return createEventItemTemplate(this.eventPoint, this.offers, this.destination);
  }

  //Проверка существования DOM-элемента
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  //Удаляем ссылку на DOM-элемент
  removeElement() {
    this.element = null;
  }
}

//Генерируем HTML-разметку для элемента события
function createEventItemTemplate(eventPoint, typeOffers, destination) {

  //Деструктурируем объект извлекая необходимые данные
  const {type,basePrice,isFavorite,dateFrom,dateTo,offers} = eventPoint;

  const duration = calculateDuration(dateFrom, dateTo); //Вычисляем продолжительность между датами начала и конца

  //Возвращаем разметку принимая все данные сгенерированные и вычисленные
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${humanizeDate(dateFrom, DATE_FORMATS.shortDate)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizeDate(dateFrom, DATE_FORMATS.time)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizeDate(dateTo, DATE_FORMATS.time)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${createOffersListMarkup(offers, typeOffers)}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}
