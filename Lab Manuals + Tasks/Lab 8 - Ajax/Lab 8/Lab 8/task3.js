const userList = document.getElementById('user-list');
const searchBar = document.getElementById('search-bar');
const filterDropdown = document.getElementById('filter-dropdown');
const userDetailsModal = document.getElementById('user-details');
const closeDetailsButton = document.getElementById('close-details');


let users = [];
let filteredUsers = [];


// Fetch users from the API
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(data => {
        users = data;
        filteredUsers = users;
        populateDropdown();
        renderUserList();
    })
    .catch(error => console.error('Error fetching data:', error));


// Populate dropdown with company names
function populateDropdown() {
    const uniqueCompanies = new Set();
    users.forEach(user => uniqueCompanies.add(user.company.name));
    uniqueCompanies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.text = company;
        filterDropdown.add(option);
    });
}


// Render user list
function renderUserList() {
    userList.innerHTML = '';
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>${user.company.name}</p>
        `;
        userCard.addEventListener('click', () => {
            showUserDetails(user);
        });
        userList.appendChild(userCard);
    });
}


// Show user details in a modal
function showUserDetails(user) {
    userDetailsModal.querySelector('#user-name').textContent = user.name;
    userDetailsModal.querySelector('#user-email').textContent = user.email;
    userDetailsModal.querySelector('#user-username').textContent = user.username;
    userDetailsModal.querySelector('#user-phone').textContent = user.phone;
    userDetailsModal.querySelector('#user-website').textContent = user.website;
    userDetailsModal.querySelector('#user-company').textContent = user.company.name;
    userDetailsModal.querySelector('#user-catchPhrase').textContent = user.company.catchPhrase;
    userDetailsModal.querySelector('#user-bs').textContent = user.company.bs;
    userDetailsModal.querySelector('#user-address').textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
    userDetailsModal.style.display = 'block';
}


// Close user details modal
closeDetailsButton.addEventListener('click', () => {
    userDetailsModal.style.display = 'none';
});


// Search and Filter Functionality
searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
    });
    renderUserList();
});


filterDropdown.addEventListener('change', () => {
    const selectedCompany = filterDropdown.value;
    filteredUsers = users.filter(user => {
        return selectedCompany === '' || user.company.name === selectedCompany;
    });
    renderUserList();
});
