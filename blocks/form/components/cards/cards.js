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
  const unused = [parentElement, formId];
  void unused;

  const properties = fieldJson?.properties || {};
  const enumValues = properties.enum || [];
  const enumNames = properties.enumNames || enumValues;

  if (!enumValues.length) {
    fieldDiv.textContent = 'No card options found';
    return fieldDiv;
  }

  const container = document.createElement('div');
  container.className = 'cards-container';

  enumValues.forEach((value, index) => {
    const label = document.createElement('label');
    label.className = 'card';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = properties.name || fieldJson?.name || 'cards';
    input.value = value;
    input.className = 'card-input';

    if (properties.default === value) {
      input.checked = true;
      label.classList.add('selected');
    }

    input.addEventListener('change', () => {
      container.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('selected');
      });
      label.classList.add('selected');
    });

    const text = document.createElement('span');
    text.className = 'card-label';
    text.textContent = enumNames[index] || value;

    label.append(input, text);
    container.append(label);
  });

  fieldDiv.innerHTML = '';
  fieldDiv.append(container);

  return fieldDiv;
}
