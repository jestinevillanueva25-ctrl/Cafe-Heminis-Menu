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
            const foodList = document.getElementById('food-list');
            const drinksList = document.getElementById('drinks-list');

            // possible column names in the sheet that may contain image URLs
            const imageKeys = ['ImageURL','Image_URL','ImageUrl','Image','image','Photo','photo','Picture','picture','Img','img','Photo_URL','PhotoUrl'];

            function findImageUrl(item){
                for(const k of imageKeys){
                    if(item[k] && item[k].toString().trim() !== '') return item[k].toString().trim();
                }
                return null;
            }

            function normalizeDriveUrl(url){
                // Convert common Google Drive share links to a direct image link that works in an <img>
                try{
                    if(!url) return url;
                    // Trim surrounding whitespace
                    url = url.trim();
                    if(/drive\.google\.com/.test(url)){
                        // id=FILE_ID
                        const m1 = url.match(/[?&]id=([^&]+)/);
                        if(m1 && m1[1]) return 'https://drive.google.com/uc?export=view&id=' + m1[1];
                        // /d/FILE_ID/
                        const m2 = url.match(/\/d\/([^\/]+)\//);
                        if(m2 && m2[1]) return 'https://drive.google.com/uc?export=view&id=' + m2[1];
                        // share link ending with ?usp=sharing or similar - try to extract last path segment
                        const m3 = url.match(/drive\.google\.com\/file\/d\/([^\/]+)(?:\/|$)/);
                        if(m3 && m3[1]) return 'https://drive.google.com/uc?export=view&id=' + m3[1];
                    }
                }catch(e){/* ignore and return original */}
                return url;
            }

            data.forEach(item => {
                const li = document.createElement('li');
                // Check if available (column in Google Sheet)
                li.className = item.Available === 'No' ? 'menu-item is-sold-out' : 'menu-item';

                // Build inner structure so images load reliably
                const meta = document.createElement('div');
                meta.className = 'item-meta';

                const main = document.createElement('div');
                main.className = 'item-main';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'name';
                nameSpan.textContent = item.Name || '';

                const priceSpan = document.createElement('span');
                priceSpan.className = 'price';
                priceSpan.textContent = item.Price || '';

                main.appendChild(nameSpan);
                main.appendChild(priceSpan);

                const details = document.createElement('div');
                details.className = 'item-details';
                const p = document.createElement('p');
                p.textContent = item.Ingredients || '';
                details.appendChild(p);

                meta.appendChild(main);
                meta.appendChild(details);

                // IMAGE (if any)
                const imageUrl = findImageUrl(item);
                if(imageUrl){
                    const imgDiv = document.createElement('div');
                    imgDiv.className = 'item-photo-wrapper';
                    const img = document.createElement('img');
                    img.className = 'item-photo';
                    img.src = normalizeDriveUrl(imageUrl);
                    img.alt = item.Name || '';
                    img.loading = 'lazy';
                    // hide broken images
                    img.addEventListener('error', () => {
                        img.style.display = 'none';
                    });
                    imgDiv.appendChild(img);
                    // append image before meta so it displays nicely depending on CSS
                    li.appendChild(imgDiv);
                }

                li.appendChild(meta);

                if (item.Category === 'Food') {
                    foodList.appendChild(li);
                } else {
                    drinksList.appendChild(li);
                }
            });
        })
        .catch(err => {
            console.error('Failed to load menu data', err);
        });
});
