document.addEventListener('DOMContentLoaded', () => {
    // 1. TAB SWITCHING
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

    // 2. FETCH MENU
    const API_URL = "https://sheetdb.io/api/v1/sxs267ijezbcw";
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                const listId = item.Category === 'Food' ? 'food-list' : 'drinks-list';
                const listElement = document.getElementById(listId);
                const groupId = item.Group.replace(/\s+/g, '-').toLowerCase();
                let groupContainer = document.getElementById(groupId);

                if (!groupContainer) {
                    groupContainer = document.createElement('div');
                    groupContainer.id = groupId;
                    groupContainer.className = 'menu-group-tile';

                    groupContainer.innerHTML = `
                        <h3 class="group-heading collapsible" style="cursor:pointer;">
                            <span class="group-text">${item.Group}</span> 
                            <span class="arrow">▾</span>
                        </h3>
                        <ul class="menu-items-list" style="display:none;"></ul> 
                    `;
                    listElement.appendChild(groupContainer);

                    // Fixed Click Toggle Logic
                    groupContainer.querySelector('.group-heading').addEventListener('click', (e) => {
                        const heading = e.currentTarget;
                        const list = heading.nextElementSibling;
                        const arrow = heading.querySelector('.arrow');
                        
                        const isHidden = list.style.display === 'none';
                        list.style.display = isHidden ? 'block' : 'none';
                        arrow.innerText = isHidden ? '▴' : '▾';
                    });
                }

                const ul = groupContainer.querySelector('.menu-items-list');
                const li = document.createElement('li');
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

    // 3. IMAGE MODAL
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('featuredPhoto');
    const closeBtn = document.getElementById('closeModal');
    const backdrop = document.getElementById('modalBackdrop');

    document.addEventListener('click', (e) => {
        const target = e.target.closest('.item-photo');
        if (target) {
            modal.classList.add('open');
            modalImg.src = target.src;
        }
    });

    const close = () => modal.classList.remove('open');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
});