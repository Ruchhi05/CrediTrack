const API_BASE = "http://localhost:5000/api";
const API_URL = `${API_BASE}/transactions`;

const list = document.getElementById("list");
const form = document.getElementById("form");
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "login.html";
}

// ===== LOGOUT BUTTON =====
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

let allTransactions = [];
let currentFilter = "all";
let currentSort = "newest";
let currentCategory = "all";
let searchQuery = "";

// ===== TYPE TOGGLE =====
let selectedType = null;

const incomeBtn = document.getElementById("addIncomeBtn");
const expenseBtn = document.getElementById("addExpenseBtn");


incomeBtn.addEventListener("click", () => {
  selectedType = "income";
  incomeBtn.classList.add("active");
  expenseBtn.classList.remove("active");
});

expenseBtn.addEventListener("click", () => {
  selectedType = "expense";
  expenseBtn.classList.add("active");
  incomeBtn.classList.remove("active");
});


async function getTransactions() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();
    allTransactions = data.data || [];
    renderTransactions();

  } catch (error) {
    console.error("Failed to fetch transactions:", error);
  }
}

function renderTransactions() {
  list.innerHTML = "";

  let total = 0;
  let income = 0;
  let expense = 0;

  let filtered = [...allTransactions];

  if (currentFilter === "income") {
    filtered = filtered.filter(tx => tx.amount > 0);
  }

  if (currentFilter === "expense") {
    filtered = filtered.filter(tx => tx.amount < 0);
  }

  if (searchQuery.trim() !== "") {
    filtered = filtered.filter(tx =>
      tx.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (currentCategory !== "all") {
  filtered = filtered.filter(tx => tx.category === currentCategory);
  }


  // SORTING
  if (currentSort === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (currentSort === "oldest") {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (currentSort === "high") {
    filtered.sort((a, b) => b.amount - a.amount);
  }

  if (currentSort === "low") {
    filtered.sort((a, b) => a.amount - b.amount);
  }

  


  filtered.forEach(tx => {

    total += tx.amount;

    if (tx.amount > 0) {
      income += tx.amount;
    } else {
      expense += tx.amount;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="tx-text">${tx.text}</span>
      <div class="tx-right">
          <span class="tx-amount">₹${Math.abs(tx.amount)}</span>
          <button class="edit-btn">
            <i class="fas fa-pen"></i>
          </button>
          <button class="delete-btn">✕</button>
      </div>
    `;

    li.classList.add(tx.amount >= 0 ? "plus" : "minus");

    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
      openEditModal(tx._id);
    });

    deleteBtn.addEventListener("click", () => {
      deleteTransaction(tx._id);
    });

    list.appendChild(li);
  });
  
  
  const balanceCard = document.querySelector(".balance-card");
  const balanceEl = document.getElementById("balance");

  balanceEl.innerText = `₹${Math.abs(total)}`;


  // Remove old classes
  balanceCard.classList.remove("balance-negative", "balance-positive");

  // If expense > income → red
  if (Math.abs(expense) > income) {
    balanceCard.classList.add("balance-negative");
  } else {
    balanceCard.classList.add("balance-positive");
  }

  document.getElementById("incomeTotal").innerText = `Income: ₹${income}`;
  document.getElementById("expenseTotal").innerText = `Expense: ₹${Math.abs(expense)}`;


  // ===== CATEGORY SUMMARY =====

  const summaryContainer = document.getElementById("categorySummary");
  summaryContainer.innerHTML = "";

  let categoryTotals = {};

  filtered.forEach(tx => {

    const amount = Number(tx.amount);

    if (amount < 0) {

      const category = tx.category || "Other";

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += Math.abs(amount);
    }
  });

  Object.keys(categoryTotals).forEach(category => {

    const row = document.createElement("div");
    row.classList.add("summary-row");

    row.innerHTML = `
      <span>${category}</span>
      <span>₹${categoryTotals[category]}</span>
    `;

    summaryContainer.appendChild(row);
  });

  // ===== CHART =====

  const ctx = document.getElementById("expenseChart").getContext("2d");

  // Destroy old chart if exists
  if (window.expenseChartInstance) {
    window.expenseChartInstance.destroy();
  }

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  window.expenseChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#2e7d32",
          "#c62828",
          "#1565c0",
          "#ff8f00",
          "#6a1b9a",
          "#00897b"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });




}


let deleteId = null;
let editId = null;


function deleteTransaction(id) {
  deleteId = id;
  document.getElementById("confirmModal").classList.remove("hidden");
}

function openEditModal(id) {
  editId = id;

  const tx = allTransactions.find(t => t._id === id);

  if (!tx) return;

  document.getElementById("editText").value = tx.text;
  document.getElementById("editAmount").value = tx.amount;
  document.getElementById("editCategory").value = tx.category;


  document.getElementById("editModal").classList.remove("hidden");
}

document.getElementById("confirmYes").addEventListener("click", async () => {
  await fetch(`${API_URL}/${deleteId}`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`
    }
  });


  document.getElementById("confirmModal").classList.add("hidden");
  await getTransactions();
});

document.getElementById("confirmNo").addEventListener("click", () => {
  document.getElementById("confirmModal").classList.add("hidden");
});

document.getElementById("cancelEdit").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
  editId = null;
});

document.getElementById("saveEdit").addEventListener("click", async () => {

  const updatedText = document.getElementById("editText").value;
  const updatedAmount = Number(document.getElementById("editAmount").value);
  const updatedCategory = document.getElementById("editCategory").value;


  await fetch(`${API_URL}/${editId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    text: updatedText,
    amount: updatedAmount,
    category: updatedCategory
    })
  });

  document.getElementById("editModal").classList.add("hidden");

  await getTransactions();
});






// ADD
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("text").value.trim();
  let amount = Number(document.getElementById("amount").value);

  if (!text || isNaN(amount)) {
    alert("Please enter valid description and amount.");
    return;
  }

  if (amount === 0) {
    alert("Amount cannot be 0.");
    return;
  }

   if (!selectedType) {
    document.getElementById("typeWarningModal")
    .classList.remove("hidden");
   return;
  }

  const category = document.getElementById("category").value;

  if (!category) {
  document.getElementById("categoryWarningModal")
    .classList.remove("hidden");
  return;
  }

  if (selectedType === "expense") {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text, amount, category })
  });

  form.reset();
  selectedType = null;
  incomeBtn.classList.remove("active");
  expenseBtn.classList.remove("active");

  await getTransactions();

});

document.getElementById("filterAll").addEventListener("click", () => {
  currentFilter = "all";
  setActiveFilter("filterAll");
  renderTransactions();
});

document.getElementById("filterIncome").addEventListener("click", () => {
  currentFilter = "income";
  setActiveFilter("filterIncome");
  renderTransactions();
});

document.getElementById("filterExpense").addEventListener("click", () => {
  currentFilter = "expense";
  setActiveFilter("filterExpense");
  renderTransactions();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderTransactions();
});

document.getElementById("sortOption").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderTransactions();
});

document.getElementById("categoryFilter")
  .addEventListener("change", (e) => {
    currentCategory = e.target.value;
    renderTransactions();
});

document.getElementById("typeOkBtn")
  .addEventListener("click", () => {
    document.getElementById("typeWarningModal")
      .classList.add("hidden");
});

document.getElementById("categoryOkBtn")
  .addEventListener("click", () => {
    document.getElementById("categoryWarningModal")
      .classList.add("hidden");
});





function setActiveFilter(activeId) {
  document.querySelectorAll(".filter-buttons button")
    .forEach(btn => btn.classList.remove("active-filter"));

  document.getElementById(activeId).classList.add("active-filter");
}








// LOAD ON START
getTransactions();


