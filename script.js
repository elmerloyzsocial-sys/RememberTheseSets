// script.js
document.addEventListener('DOMContentLoaded', () => {
    const items = JSON.parse(localStorage.getItem('exerciseItems')) || [];
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
    const addButton = document.getElementById('add-button');
    const cancelEditButton = document.getElementById('cancel-edit');
    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('url');
    const categoryInput = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter-category');
    const itemList = document.querySelector('#item-list ul');

    let editIndex = -1;

    if (darkMode) {
        body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });

    const saveItems = () => {
        localStorage.setItem('exerciseItems', JSON.stringify(items));
    };

    const populateCategories = () => {
        const categories = [...new Set(items.map(item => item.category))];
        filterSelect.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filterSelect.appendChild(option);
        });
    };

    const renderItems = (filteredItems = items) => {
        itemList.innerHTML = '';
        filteredItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${item.title}</strong> (Category: ${item.category})
                <div class="item-content">
                    ${getContentHTML(item.url)}
                </div>
                <div class="item-actions">
                    <button onclick="editItem(${index})">Edit</button>
                    <button onclick="deleteItem(${index})">Delete</button>
                </div>
            `;
            itemList.appendChild(li);
        });
    };

    const getContentHTML = (url) => {
        if (url.endsWith('.gif')) {
            return `<img src="${url}" alt="GIF">`;
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
            return videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : `<a href="${url}" target="_blank">View Video</a>`;
        } else {
            return `<a href="${url}" target="_blank">View Link</a>`;
        }
    };

    window.editItem = (index) => {
        editIndex = index;
        titleInput.value = items[index].title;
        urlInput.value = items[index].url;
        categoryInput.value = items[index].category;
        addButton.textContent = 'Update Exercise';
        cancelEditButton.style.display = 'inline';
    };

    window.deleteItem = (index) => {
        items.splice(index, 1);
        saveItems();
        populateCategories();
        renderItems();
    };

    addButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();
        const category = categoryInput.value.trim();

        if (title && url && category) {
            if (editIndex === -1) {
                items.push({ title, url, category });
            } else {
                items[editIndex] = { title, url, category };
                editIndex = -1;
                addButton.textContent = 'Add Exercise';
                cancelEditButton.style.display = 'none';
            }
            saveItems();
            populateCategories();
            renderItems();
            titleInput.value = '';
            urlInput.value = '';
            categoryInput.value = '';
        }
    });

    cancelEditButton.addEventListener('click', () => {
        editIndex = -1;
        addButton.textContent = 'Add Exercise';
        cancelEditButton.style.display = 'none';
        titleInput.value = '';
        urlInput.value = '';
        categoryInput.value = '';
    });

    const filterItems = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value;

        const filtered = items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.category.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderItems(filtered);
    };

    searchInput.addEventListener('input', filterItems);
    filterSelect.addEventListener('change', filterItems);

    populateCategories();
    renderItems();
});
