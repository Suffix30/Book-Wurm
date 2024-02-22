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

function openPDF(pdfURL) {
    var placeholder = document.getElementById('placeholder');
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    var pdfDisplay = document.getElementById('pdf-display');
    pdfDisplay.innerHTML = '<object type="application/pdf" data="' + pdfURL + '" width="100%" height="100%"></object>';
}


displayPDFThumbnails(pdfList);
