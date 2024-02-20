const pdfList = [
    { title: "PDF Title 1", category: "Category1", path: "path/to/pdf1.pdf" },
    { title: "PDF Title 2", category: "Category2", path: "path/to/pdf2.pdf" },
];

function filterByCategory(category) {
    const filteredList = category === 'All' ? pdfList : pdfList.filter(pdf => pdf.category === category);
    displayPDFThumbnails(filteredList);
}

document.getElementById('searchBar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredList = pdfList.filter(pdf => pdf.title.toLowerCase().includes(searchTerm));
    displayPDFThumbnails(filteredList);
});

function displayPDFThumbnails(list) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    list.forEach(pdf => {
        const img = document.createElement('img');
        img.src = `images/${pdf.title}.png`;
        img.alt = pdf.title;
        img.className = 'pdf-thumbnail';
        img.onclick = () => openPDF(pdf.path);
        sidebar.appendChild(img);
    });
}

function openPDF(pdfPath) {
    const placeholder = document.getElementById('placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    const pdfDisplay = document.getElementById('pdf-display');
    pdfDisplay.innerHTML = `<object type="application/pdf" data="${pdfPath}" width="100%" height="100%"></object>`;
}

displayPDFThumbnails(pdfList);
