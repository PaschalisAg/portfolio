(function () {
    const figures = document.querySelectorAll('.article-figure');

    if (!figures.length) {
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="image-zoom-content" role="dialog" aria-modal="true" aria-label="Expanded plot">
            <button class="image-zoom-close" type="button" aria-label="Close expanded plot">&times;</button>
            <img alt="">
            <p class="image-zoom-caption"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = modal.querySelector('img');
    const modalCaption = modal.querySelector('.image-zoom-caption');
    const closeButton = modal.querySelector('.image-zoom-close');
    let lastTrigger;

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('image-zoom-open');
        modalImage.removeAttribute('src');
        lastTrigger?.focus();
    }

    function openModal(image, trigger) {
        lastTrigger = trigger;
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent.trim() || '';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('image-zoom-open');
        closeButton.focus();
    }

    figures.forEach((figure) => {
        const image = figure.querySelector('img');

        if (!image) {
            return;
        }

        const trigger = document.createElement('button');
        trigger.className = 'figure-zoom-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-label', `Expand plot: ${image.alt}`);
        image.replaceWith(trigger);
        trigger.appendChild(image);
        trigger.addEventListener('click', () => openModal(image, trigger));
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
})();