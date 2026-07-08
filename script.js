document.addEventListener('DOMContentLoaded', () => {
    // 1. TAB SWITCHING LOGIC
    const tabs = document.querySelectorAll('.menu-tab');
    const panels = document.querySelectorAll('.menu-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            panels.forEach(p => p.classList.remove('is-active'));
            tab.classList.add('is-active');
            document.getElementById(tab.dataset.panel).classList.add('is-active');
        });
    });

    // 2. FETCH MENU FROM GOOGLE SHEET
    const API_URL = "https://sheetdb.io/api/v1/gm3z35hrm9twa";

    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const listId = item.Category === 'Food' ? 'food-list' : 'drinks-list';
            const listElement = document.getElementById(listId);

            const groupId = item.Group.replace(/\s+/g, '-').toLowerCase();
            let groupContainer = document.getElementById(groupId);

            // Create tile if it doesn't exist
            if (!groupContainer) {
                groupContainer = document.createElement('div');
                groupContainer.id = groupId;
                groupContainer.className = 'menu-group-tile';
                
                groupContainer.innerHTML = `
                    <h3>${item.Group}</h3>
                    <ul class="menu-items-list"></ul>
                `;
                listElement.appendChild(groupContainer);
            }

            // Always find the UL inside the current tile
            const ul = groupContainer.querySelector('.menu-items-list');
            const div = document.createElement('li');
            li.className = item.Available === 'No' ? 'menu-item is-sold-out' : 'menu-item';
            li.innerHTML = `
                <div class="item-meta">
                 <div class="item-main">
                    <span class="name">${item.Name}</span>
                   <span class="price">${item.Price}</span>
                 </div>
                 <div class="item-details"><p>${item.Ingredients}</p></div>
                 </div>
                 <div class="item-photo-wrapper">
                      <img class="item-photo" src="${item.ImageURL}" alt="${item.Name}" onerror="this.style.display='none'">
                 </div>`;
            ul.appendChild(li);
        });
    });

    // 3. IMAGE MODAL LOGIC (Kept outside the fetch loop)
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('featuredPhoto');
    const closeBtn = document.getElementById('closeModal');
    const modalBackdrop = document.getElementById('modalBackdrop');

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('item-photo')) {
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            modalImg.src = event.target.src;
            modalImg.alt = event.target.alt;
        }
    });

    const closeModal = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
});
