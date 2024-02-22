import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/621d054866015f30cb932cc457e25043/raw/61ef690a83a3022fd6b420b79b9944ed5c236343/stats-preview-data.txt';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardImageTemplate = document.getElementById('card-image-template');
const cardStatusItemTemplate = document.getElementById(
	'card-stat-item-template'
);
const cardContentTemplate = document.getElementById('card-content-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const [title, description, imageInfo, ...statuses] = data.split('\n');
	const [imageSrc, imageAlt] = imageInfo.split(' | ');
	const filteredStatuses = statuses.filter((link) => Boolean(link));

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	/* [card image] */
	const cardImageTemplateNode = document.importNode(
		cardImageTemplate.content,
		true
	);
	const cardImageEl = cardImageTemplateNode.querySelector('.card__image img');
	cardImageEl.src = './images/' + imageSrc;
	cardImageEl.alt = imageAlt;

	/* [card content] */
	const cardContentTemplateNode = document.importNode(
		cardContentTemplate.content,
		true
	);
	const cardContentEl =
		cardContentTemplateNode.querySelector('.card__content');

	const cardTitleEl = cardContentEl.querySelector('.card__title');
	cardTitleEl.textContent = title;

	const cardDescriptionEl = cardContentEl.querySelector('.card__desc');
	cardDescriptionEl.textContent = description;

	const cardStatusListEl = cardContentEl.querySelector('.card__stats-list');

	for (const status of filteredStatuses) {
		const [amount, label] = status.split(' ');

		const cardStatusItemTemplateNode = document.importNode(
			cardStatusItemTemplate.content,
			true
		);
		const cardStatusItemEl = cardStatusItemTemplateNode.querySelector(
			'.card__stats-list-item'
		);

		const cardStatusItemAmountEl = cardStatusItemEl.querySelector('.num');
		cardStatusItemAmountEl.textContent = amount;

		const cardStatusItemLabelEl = cardStatusItemEl.querySelector('.label');
		cardStatusItemLabelEl.textContent = label;

		cardStatusListEl.appendChild(cardStatusItemTemplateNode);
	}

	/* [init] */
	removeLoading();
	cardEl.appendChild(cardImageTemplateNode);
	cardEl.appendChild(cardContentTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
