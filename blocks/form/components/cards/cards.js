export default async function decorate(fieldDiv) {

  const options = [
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' }
  ];

  const container = document.createElement('div');
  container.className = 'cards-container';

  options.forEach((opt) => {
    const card = document.createElement('label');
    card.className = 'card';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'cards';
    input.value = opt.value;

    input.addEventListener('change', () => {
      container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });

    const text = document.createElement('span');
    text.className = 'card-label';
    text.textContent = opt.label;

    card.append(input, text);
    container.append(card);
  });

  fieldDiv.innerHTML = '';
  fieldDiv.append(container);

  return fieldDiv;
}
