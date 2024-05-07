let currentUserId, currentUsername, productType;
function displayUsername(username) {
    const usernameSpan = document.getElementById('username');
    usernameSpan.textContent = "Hello, " + username;
}

async function fetchProducts(url) {
    const response = await fetch(url);
    return await response.json();
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function getForeignKeyName(id, type) {
    let url = `http://127.0.0.1:8082/product/api/${type}/${id}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('There was an error:', error);
    }
}

async function getForeignKeyNames(ids, type) {
    const promises = ids.map(async id => {
        let url = `http://127.0.0.1:8082/product/api/${type}/${id}/`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response for ${id} was not ok`);
            }
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error(`There was an error for ${id}:`, error);
            return null;
        }
    });

    return Promise.all(promises);
}