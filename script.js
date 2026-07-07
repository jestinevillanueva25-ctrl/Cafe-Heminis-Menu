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
    const API_URL = https://sheetdb.io/api/v1/gm3z35hrm9twa; 

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const foodList = document.getElementById('food-list');
            const drinksList = document.getElementById('drinks-list');

            data.forEach(item => {
                const li = document.createElement('li');
                // Check if available (column F in Google Sheet)
                li.className = item.Available === 'No' ? 'menu-item is-sold-out' : 'menu-item';
                
                li.innerHTML = `
                    <div class="item-meta">
                        <div class="item-main">
                            <span class="name">${item.Name}</span>
                            <span class="price">${item.Price}</span>
                        </div>
                        <div class="item-details"><p>${item.Ingredients}</p></div>
                    </div>`;

                if (item.Category === 'Food') {
                    foodList.appendChild(li);
                } else {
                    drinksList.appendChild(li);
                }
            });
        });
});
