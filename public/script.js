document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript is loaded and running");

    const tableBody = document.getElementById("tableBody");
    const searchInput = document.getElementById("searchInput");
    const addArticleBtn = document.getElementById("addArticleBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const addArticleForm = document.getElementById("addArticleForm");
    const newArticleForm = document.getElementById("newArticleForm");
    const editDeletePopup = document.getElementById("editDeletePopup");
    const closeEditDeletePopupBtn = document.getElementById("closeEditDeletePopupBtn");
    const editPopupBtn = document.getElementById("editPopupBtn");
    const deletePopupBtn = document.getElementById("deletePopupBtn");
    const editArticleForm = document.getElementById("editArticleForm");
    const editArticleFormElement = document.getElementById("editArticleFormElement");
    const closeEditFormBtn = document.getElementById("closeEditFormBtn");
    let articles = [];
    let currentArticle = null;

    async function fetchArticles() {
        try {
            const response = await fetch('/api/articles');
            articles = await response.json();
            renderTable(articles);
        } catch (err) {
            console.error('Error fetching articles:', err);
            tableBody.innerHTML = '<tr><td colspan="7">Failed to load articles. Please try again later.</td></tr>';
        }
    }

    function renderTable(articlesToRender) {
        tableBody.innerHTML = "";
        const fragment = document.createDocumentFragment();
        articlesToRender.forEach(article => {
            if (article.prix === article.promotion) {
                article.promotion = "";
            }
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${article.ref}</td>
                <td>${article.frs}</td>
                <td>${article.article}</td>
                <td>${article.prix}</td>
                <td style="color:red;">${article.promotion || ''}</td>
                <td style="color: green;">${article.stock}</td>
                <td><img src="${article.srcImg}" alt="${article.article}" data-ref="${article.ref}" class="article-img" data-id="${article._id}"></td>
            `;
            fragment.appendChild(row);
        });
        tableBody.appendChild(fragment);
    }

    newArticleForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const newArticle = {
            ref: document.getElementById('newRef').value,
            frs: document.getElementById('newFrs').value,
            article: document.getElementById('newArticle').value,
            prix: document.getElementById('newPrix').value,
            promotion: document.getElementById('newPromotion').value || '',
            stock: document.getElementById('newStock').value,
            srcImg: document.getElementById('newSrcImg').value
        };
        if (newArticle.prix === newArticle.promotion) {
            newArticle.promotion = "";
        }
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle)
            });
            if (response.ok) {
                const createdArticle = await response.json();
                articles.push(createdArticle);
                renderTable(articles);
                addArticleForm.style.display = 'none';
                newArticleForm.reset();
            } else {
                console.error('Failed to add article');
            }
        } catch (err) {
            console.error('Error adding article:', err);
        }
    });

    addArticleBtn.addEventListener('click', function () {
        addArticleForm.style.display = 'flex';
    });

    closeFormBtn.addEventListener('click', function () {
        addArticleForm.style.display = 'none';
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let filteredArticles = articles;

        if (searchTerm === "promo") {
            filteredArticles = articles.filter(article =>
                article.promotion && article.promotion !== ""
            );
        } else {
            filteredArticles = articles.filter(article =>
                article.article.toLowerCase().includes(searchTerm)
            );
        }

        renderTable(filteredArticles);
    });

    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('article-img')) {
            const id = event.target.getAttribute('data-id');
            currentArticle = articles.find(article => article._id === id);
            if (currentArticle) {
                editDeletePopup.style.display = 'flex';
            }
        }
    });

    editPopupBtn.addEventListener('click', function () {
        if (currentArticle) {
            document.getElementById('editRef').value = currentArticle.ref;
            document.getElementById('editFrs').value = currentArticle.frs;
            document.getElementById('editArticle').value = currentArticle.article;
            document.getElementById('editPrix').value = currentArticle.prix;
            document.getElementById('editPromotion').value = currentArticle.promotion || '';
            document.getElementById('editStock').value = currentArticle.stock;
            document.getElementById('editSrcImg').value = currentArticle.srcImg;
            editArticleForm.style.display = 'flex';
            editDeletePopup.style.display = 'none';
        }
    });

    deletePopupBtn.addEventListener('click', async function () {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            try {
                if (!currentArticle || !currentArticle._id) {
                    console.error('currentArticle or currentArticle._id is not defined');
                    return;
                }

                console.log(`Attempting to delete article with ID: ${currentArticle._id}`);

                const response = await fetch(`/api/articles/${currentArticle._id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    console.log(`Article with ID: ${currentArticle._id} deleted successfully`);
                    articles = articles.filter(article => article._id !== currentArticle._id);
                    renderTable(articles);
                    editDeletePopup.style.display = 'none';
                } else {
                    const errorMessage = await response.text();
                    console.error('Failed to delete article:', errorMessage);
                }
            } catch (err) {
                console.error('Error deleting article:', err);
            }
        }
    });

    closeEditDeletePopupBtn.addEventListener('click', function () {
        editDeletePopup.style.display = 'none';
    });

    editArticleFormElement.addEventListener('submit', async function (event) {
        event.preventDefault();
        const updatedArticle = {
            ref: document.getElementById('editRef').value,
            frs: document.getElementById('editFrs').value,
            article: document.getElementById('editArticle').value,
            prix: document.getElementById('editPrix').value,
            promotion: document.getElementById('editPromotion').value || '',
            stock: document.getElementById('editStock').value,
            srcImg: document.getElementById('editSrcImg').value
        };
        if (updatedArticle.prix === updatedArticle.promotion) {
            updatedArticle.promotion = "";
        }
        try {
            const response = await fetch(`/api/articles/${currentArticle._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedArticle)
            });
            if (response.ok) {
                const updatedArticleFromServer = await response.json();
                const index = articles.findIndex(article => article._id === currentArticle._id);
                articles[index] = updatedArticleFromServer;
                renderTable(articles);
                editArticleForm.style.display = 'none';
            } else {
                console.error('Failed to update article');
            }
        } catch (err) {
            console.error('Error updating article:', err);
        }
    });

    closeEditFormBtn.addEventListener('click', function () {
        editArticleForm.style.display = 'none';
    });

    fetchArticles();
});


window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
    scrollToTopBtn.style.animation = "fadeIn 0.3s";
  } else {
    scrollToTopBtn.style.animation = "fadeOut 0.3s";
    setTimeout(() => {
      scrollToTopBtn.style.display = "none";
    }, 300);
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
