/**
 * Universal Chip Input (Tag Input) Widget - v2.1 (Fixed & Tested)
 * Converts any <input class="chip-input"> into an interactive Tag/Chip selector.
 * Keeps the underlying input value synchronized as a comma-separated string: "tag1, tag2, tag3"
 */
function initChipInputs() {
  const inputs = document.querySelectorAll('input.chip-input');
  inputs.forEach(input => {
    if (input.dataset.chipInitialized === "true") return;
    input.dataset.chipInitialized = "true";

    // Hide original input
    input.style.display = 'none';

    // Parse existing comma-separated keywords
    let chips = input.value
      ? input.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'chip-input-wrapper';
    input.parentNode.insertBefore(wrapper, input.nextSibling);

    // Create inline text input and append to wrapper immediately
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'chip-input-text';
    textInput.placeholder = '';
    wrapper.appendChild(textInput);

    function renderChips() {
      // Remove existing chip badges
      wrapper.querySelectorAll('.chip-badge').forEach(el => el.remove());

      // Update underlying hidden input value
      input.value = chips.join(', ');

      // Render badge for each chip before textInput
      chips.forEach((chipText, index) => {
        const badge = document.createElement('span');
        badge.className = 'chip-badge';
        badge.innerHTML = `<span>${chipText}</span><span class="chip-remove" title="Hapus">&times;</span>`;

        badge.querySelector('.chip-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          chips.splice(index, 1);
          renderChips();
          textInput.focus();
        });

        wrapper.insertBefore(badge, textInput);
      });
    }

    function addChip(val) {
      const cleanVal = val.trim().replace(/,+$/, '');
      if (cleanVal && !chips.includes(cleanVal)) {
        chips.push(cleanVal);
        renderChips();
      }
      textInput.value = '';
    }

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addChip(textInput.value);
      } else if (e.key === 'Backspace' && textInput.value === '' && chips.length > 0) {
        chips.pop();
        renderChips();
      }
    });

    textInput.addEventListener('input', (e) => {
      if (textInput.value.includes(',')) {
        const parts = textInput.value.split(',');
        parts.forEach((part, idx) => {
          if (idx < parts.length - 1) {
            addChip(part);
          } else {
            textInput.value = part;
          }
        });
      }
    });

    textInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text');
      if (pasteData) {
        pasteData.split(',').forEach(item => addChip(item));
      }
    });

    textInput.addEventListener('blur', () => {
      if (textInput.value.trim() !== '') {
        addChip(textInput.value);
      }
    });

    wrapper.addEventListener('click', () => {
      textInput.focus();
    });

    renderChips();
  });
}

window.initChipInputs = initChipInputs;

// Execute immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChipInputs);
} else {
  initChipInputs();
}
window.addEventListener('load', initChipInputs);
