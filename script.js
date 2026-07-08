    // 2. FETCH MENU FROM GOOGLE SHEET
    const API_URL = "https://sheetdb.io/api/v1/gm3z35hrm9twa";

    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const listId = item.Category === 'Food' ? 'food-list' : 'drinks-list';
            const listElement = document.getElementById(listId);

            // 1. Create a heading ONLY if it doesn't exist yet
            const groupId = 'group-' + item.Group.replace(/\s+/g, '-').toLowerCase();
            if (!document.getElementById(groupId)) {
                const title = document.createElement('h3');
                title.id = groupId;
                title.className = 'group-heading';
                title.textContent = item.Group;
                listElement.appendChild(title);
            }

            // 2. Create the item card (div)
            const div = document.createElement('div');
            div.className = item.Available === 'No' ? 'menu-item is-sold-out' : 'menu-item';
            
            // 3. Set the HTML structure
            div.innerHTML = `
                <div class="item-meta">
                    <div class="item-main">
                        <span class="name">${item.Name}</span>
                        <span class="price">${item.Price}</span>
                    </div>
                    <div class="item-details">
                        <strong>Ingredients:</strong> ${item.Ingredients}
                    </div>
                </div>
                <div class="item-photo-wrapper">
                    <img class="item-photo" src="${item.ImageURL}" alt="${item.Name}" onerror="this.style.display='none'">
                </div>
            `;
            
            // 4. Append the card directly to the listElement (no tile wrapper!)
            listElement.appendChild(div);
        });
    });