// Data Storage
let items = [];
let categories = [];
let units = [];
let nextItemId = 1;
let nextCategoryId = 1;
let nextUnitId = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadDataFromStorage();
    initializeSampleData();
    updateDashboard();
    showDashboard();
    displayUserInfo();
});

// Load data from localStorage
function loadDataFromStorage() {
    const storedItems = localStorage.getItem('inventoryItems');
    const storedCategories = localStorage.getItem('inventoryCategories');
    const storedUnits = localStorage.getItem('inventoryUnits');
    
    if (storedItems) {
        items = JSON.parse(storedItems);
        nextItemId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    }
    
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
        nextCategoryId = categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) + 1 : 1;
    }
    
    if (storedUnits) {
        units = JSON.parse(storedUnits);
        nextUnitId = units.length > 0 ? Math.max(...units.map(unit => unit.id)) + 1 : 1;
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    localStorage.setItem('inventoryCategories', JSON.stringify(categories));
    localStorage.setItem('inventoryUnits', JSON.stringify(units));
}

// Initialize with sample data if empty
function initializeSampleData() {
    if (categories.length === 0) {
        categories = [
            { id: nextCategoryId++, name: 'Electronics', description: 'Electronic devices and components' },
            { id: nextCategoryId++, name: 'Furniture', description: 'Office and home furniture' },
            { id: nextCategoryId++, name: 'Stationery', description: 'Office supplies and stationery items' }
        ];
    }
    
    if (units.length === 0) {
        units = [
            { id: nextUnitId++, name: 'Pieces', symbol: 'pcs' },
            { id: nextUnitId++, name: 'Kilograms', symbol: 'kg' },
            { id: nextUnitId++, name: 'Boxes', symbol: 'box' }
        ];
    }
    
    if (items.length === 0) {
        items = [
            { id: nextItemId++, name: 'Laptop Computer', unit: 'Pieces', category: 'Electronics' },
            { id: nextItemId++, name: 'Office Chair', unit: 'Pieces', category: 'Furniture' },
            { id: nextItemId++, name: 'Notebook', unit: 'Pieces', category: 'Stationery' }
        ];
    }
    
    saveDataToStorage();
}

// Navigation Functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard-section').style.display = 'block';
    setActiveNavButton('dashboard-section');
    updateDashboard();
}

function showItems() {
    hideAllSections();
    document.getElementById('items-section').style.display = 'block';
    setActiveNavButton('items-section');
    loadItems();
    populateItemDropdowns();
}

function showCategories() {
    hideAllSections();
    document.getElementById('categories-section').style.display = 'block';
    setActiveNavButton('categories-section');
    loadCategories();
}

function showUnits() {
    hideAllSections();
    document.getElementById('units-section').style.display = 'block';
    setActiveNavButton('units-section');
    loadUnits();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
}

function setActiveNavButton(sectionId) {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => button.classList.remove('active'));
    
    const buttonMap = {
        'dashboard-section': 0,
        'items-section': 1,
        'categories-section': 2,
        'units-section': 3
    };
    
    if (buttonMap[sectionId] !== undefined) {
        buttons[buttonMap[sectionId]].classList.add('active');
    }
}

// Dashboard Functions
function updateDashboard() {
    document.getElementById('total-items').textContent = items.length;
    document.getElementById('total-categories').textContent = categories.length;
    document.getElementById('total-units').textContent = units.length;
}

// Items Management
function loadItems() {
    const tbody = document.getElementById('items-table-body');
    tbody.innerHTML = '';
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-box"></i>
                        <h5>No items found</h5>
                        <p>Start by adding your first item</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchItems() {
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const rows = document.querySelectorAll('#items-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function showAddItemModal() {
    document.getElementById('addItemForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
    modal.show();
}

function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const unit = document.getElementById('itemUnit').value;
    const category = document.getElementById('itemCategory').value;
    
    if (!name || !unit || !category) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    const newItem = {
        id: nextItemId++,
        name: name,
        unit: unit,
        category: category
    };
    
    items.push(newItem);
    saveDataToStorage();
    loadItems();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
    showAlert('Item added successfully!', 'success');
}

function editItem(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const newName = prompt('Edit item name:', item.name);
    if (newName && newName.trim()) {
        item.name = newName.trim();
        saveDataToStorage();
        loadItems();
        showAlert('Item updated successfully!', 'success');
    }
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(i => i.id !== id);
        saveDataToStorage();
        loadItems();
        updateDashboard();
        showAlert('Item deleted successfully!', 'success');
    }
}

function populateItemDropdowns() {
    const unitSelect = document.getElementById('itemUnit');
    const categorySelect = document.getElementById('itemCategory');
    
    // Populate units dropdown
    unitSelect.innerHTML = '<option value="">Select Unit</option>';
    units.forEach(unit => {
        unitSelect.innerHTML += `<option value="${unit.name}">${unit.name}</option>`;
    });
    
    // Populate categories dropdown
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
    });
}

// Categories Management
function loadCategories() {
    const tbody = document.getElementById('categories-table-body');
    tbody.innerHTML = '';
    
    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-tags"></i>
                        <h5>No categories found</h5>
                        <p>Start by adding your first category</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || '-'}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchCategories() {
    const searchTerm = document.getElementById('search-categories').value.toLowerCase();
    const rows = document.querySelectorAll('#categories-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function showAddCategoryModal() {
    document.getElementById('addCategoryForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    modal.show();
}

function addCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    
    if (!name) {
        showAlert('Please enter a category name', 'error');
        return;
    }
    
    const newCategory = {
        id: nextCategoryId++,
        name: name,
        description: description
    };
    
    categories.push(newCategory);
    saveDataToStorage();
    loadCategories();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
    showAlert('Category added successfully!', 'success');
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const newName = prompt('Edit category name:', category.name);
    if (newName && newName.trim()) {
        category.name = newName.trim();
        saveDataToStorage();
        loadCategories();
        showAlert('Category updated successfully!', 'success');
    }
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories = categories.filter(c => c.id !== id);
        saveDataToStorage();
        loadCategories();
        updateDashboard();
        showAlert('Category deleted successfully!', 'success');
    }
}

// Units Management
function loadUnits() {
    const tbody = document.getElementById('units-table-body');
    tbody.innerHTML = '';
    
    if (units.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-balance-scale"></i>
                        <h5>No units found</h5>
                        <p>Start by adding your first unit</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    units.forEach(unit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${unit.id}</td>
            <td>${unit.name}</td>
            <td>${unit.symbol}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editUnit(${unit.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteUnit(${unit.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchUnits() {
    const searchTerm = document.getElementById('search-units').value.toLowerCase();
    const rows = document.querySelectorAll('#units-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function showAddUnitModal() {
    document.getElementById('addUnitForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addUnitModal'));
    modal.show();
}

function addUnit() {
    const name = document.getElementById('unitName').value.trim();
    const symbol = document.getElementById('unitSymbol').value.trim();
    
    if (!name || !symbol) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    const newUnit = {
        id: nextUnitId++,
        name: name,
        symbol: symbol
    };
    
    units.push(newUnit);
    saveDataToStorage();
    loadUnits();
    updateDashboard();
    
    bootstrap.Modal.getInstance(document.getElementById('addUnitModal')).hide();
    showAlert('Unit added successfully!', 'success');
}

function editUnit(id) {
    const unit = units.find(u => u.id === id);
    if (!unit) return;
    
    const newName = prompt('Edit unit name:', unit.name);
    const newSymbol = prompt('Edit unit symbol:', unit.symbol);
    
    if (newName && newName.trim() && newSymbol && newSymbol.trim()) {
        unit.name = newName.trim();
        unit.symbol = newSymbol.trim();
        saveDataToStorage();
        loadUnits();
        showAlert('Unit updated successfully!', 'success');
    }
}

function deleteUnit(id) {
    if (confirm('Are you sure you want to delete this unit?')) {
        units = units.filter(u => u.id !== id);
        saveDataToStorage();
        loadUnits();
        updateDashboard();
        showAlert('Unit deleted successfully!', 'success');
    }
}

// Utility Functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-custom alert-${type}-custom fade-in`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    const container = document.querySelector('.main-content');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Authentication Functions
function checkAuthentication() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        redirectToLogin();
    }
}

function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

function displayUserInfo() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Add user info to the dedicated container
        const userInfoContainer = document.getElementById('user-info-container');
        if (userInfoContainer) {
            userInfoContainer.innerHTML = `
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span>Welcome, <strong>${currentUser.name}</strong></span>
                    <span class="user-role">(${currentUser.role})</span>
                </div>
            `;
        }
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        
        // Keep inventory data, only clear auth
        redirectToLogin();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N for new item
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const itemsSection = document.getElementById('items-section');
        if (itemsSection.style.display !== 'none') {
            showAddItemModal();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            bootstrap.Modal.getInstance(modal).hide();
        });
    }
});
