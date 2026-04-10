/**
 * Custom cards component
 * Based on: Radio Group
 */

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The DOM element containing the field wrapper.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent container element of the field.
 * @param {string} formId - The unique identifier of the form.
 * @returns {HTMLElement} Decorated field wrapper.
 */
export default async function decorate(fieldDiv, fieldJson, parentElement, formId) {
  const unused = [fieldJson, parentElement, formId];
  void unused;

  const optionLabels = fieldDiv.querySelectorAll('label');

  if (!optionLabels.length) {
    return fieldDiv;
  }

  const container = document.createElement('div');
  container.className = 'cards-container';

  optionLabels.forEach((label) => {
    const input = label.querySelector('input');

    if (!input) {
      return;
    }

    const card = document.createElement('label');
    card.className = 'card';

    if (input.checked) {
      card.classList.add('selected');
    }

    input.classList.add('card-input');

    const text = document.createElement('span');
    text.className = 'card-label';
    text.textContent = label.textContent.trim();

    card.append(input, text);

    card.addEventListener('click', () => {
      container.querySelectorAll('.card').forEach((item) => {
        item.classList.remove('selected');
      });
      card.classList.add('selected');
    });

    container.append(card);
  });

  fieldDiv.innerHTML = '';
  fieldDiv.append(container);

  return fieldDiv;
}
